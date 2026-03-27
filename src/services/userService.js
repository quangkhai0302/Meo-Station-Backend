import bcryptjs from "bcryptjs";
import { StatusCodes } from "http-status-codes";
import { v4 as uuidV4 } from "uuid";
import { env } from "~/config/environment";
import { userModel } from "~/models/userModel";
import { BrevoProvider } from "~/providers/BrevoProvider";
import { CloudinaryProvider } from "~/providers/CloudinaryProvider";
import { JwtProvider } from "~/providers/JwtProvider";
import ApiError from "~/utils/ApiError";
import { WEBSITE_DOMAINS } from "~/utils/constants";
import { pickUser } from "~/utils/formatters";

const createNew = async (reqBody) => {
  try {
    const existingUser = await userModel.findOneByEmail(reqBody.email);
    if (existingUser) {
      throw new ApiError(StatusCodes.CONFLICT, "Email already existed!!!");
    }

    const newUser = {
      email: reqBody.email,
      password: bcryptjs.hashSync(reqBody.password, 8),
      username: reqBody.username,
      displayName: reqBody.username,
      verifyToken: uuidV4(),
    };

    const createdUser = await userModel.createNew(newUser);
    const getNewUser = await userModel.findOneById(createdUser.insertedId);

    const verificationLink = `${WEBSITE_DOMAINS}/account/verification?email=${getNewUser.email}&token=${getNewUser.verifyToken}`;

    const customSubject = "ADMIN MeoStation: Vui lòng xác minh email!";

    const htmlContent = `
  <h3>Đây là đường dẫn xác thực email:</h3>
  <h3>${verificationLink}</h3>
  <h3>Sincerely,<br/>- ADMIN MeoStation -</h3>
`;

    await BrevoProvider.sendEmail(getNewUser.email, customSubject, htmlContent);

    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};

const verifyAccount = async (reqBody) => {
  try {
    const existingUser = await userModel.findOneByEmail(reqBody.email);
    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "User not found!!!");
    }
    if (existingUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is already activated!!!"
      );
    }
    if (reqBody.token !== existingUser.verifyToken) {
      throw new ApiError(StatusCodes.NOT_ACCEPTABLE, "Token is invalid!!!");
    }

    const updateData = {
      isActive: true,
      verifyToken: null,
    };

    const updatedUser = await userModel.update(existingUser._id, updateData);

    return pickUser(updatedUser);
  } catch (error) {
    throw error;
  }
};

// const login = async (reqBody) => {
//   try {
//     const existingUser = await userModel.findOneByEmail(reqBody.email);
//     if (!existingUser) {
//       throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!!!");
//     }

//     const matchPassword = bcryptjs.compareSync(
//       reqBody.password,
//       existingUser.password
//     );
//     if (!matchPassword) {
//       throw new ApiError(StatusCodes.UNAUTHORIZED, "Password not match!!!");
//     }

//     const userInfo = {
//       _id: existingUser._id,
//       email: existingUser.email,
//     };

//     const accessToken = await JwtProvider.generateToken(
//       userInfo,
//       env.ACCESS_TOKEN_SECRET_SIGNATURE,
//       env.ACCESS_TOKEN_LIFE
//     );

//     const refreshToken = await JwtProvider.generateToken(
//       userInfo,
//       env.REFRESH_TOKEN_SECRET_SIGNATURE,
//       env.REFRESH_TOKEN_LIFE
//     );

//     return { accessToken, refreshToken, ...pickUser(existingUser) };
//   } catch (error) {
//     throw error;
//   }
// };

const login=async(rq)=>{
try{
const a=await userModel.findOneByEmail(rq.email)
if(!a){
throw new ApiError(StatusCodes.NOT_FOUND,"not found")
}

const x=bcryptjs.compareSync(rq.password,a.password)
if(x==false){
throw new ApiError(StatusCodes.UNAUTHORIZED,"sai mk")
}

const data={id:a._id,mail:a.email}

const t1=await JwtProvider.generateToken(data,env.ACCESS_TOKEN_SECRET_SIGNATURE,env.ACCESS_TOKEN_LIFE)
const t2=await JwtProvider.generateToken(data,env.REFRESH_TOKEN_SECRET_SIGNATURE,env.REFRESH_TOKEN_LIFE)

return{t1:t1,t2:t2,...pickUser(a)}
}catch(e){throw e}
}

const refreshToken = async (clientRefreshToken) => {
  try {
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clientRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    );

    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
    };

    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    );

    return { accessToken };
  } catch (error) {
    throw error;
  }
};

const update = async (userId, reqBody, userAvatarFile) => {
  try {
    const existingUser = await userModel.findOneById(userId);
    if (!existingUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, "Account not found!!!");
    }
    if (!existingUser.isActive) {
      throw new ApiError(
        StatusCodes.NOT_ACCEPTABLE,
        "Your account is not active!!!"
      );
    }

    let updateUser = {};
    if (reqBody.current_password && reqBody.new_password) {
      const isMatchPassword = bcryptjs.compareSync(
        reqBody.current_password,
        existingUser.password
      );
      if (!isMatchPassword) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, "Invalid credentials");
      }

      updateUser = await userModel.update(userId, {
        password: bcryptjs.hashSync(reqBody.new_password, 8),
      });
    } else if (userAvatarFile) {
      const uploadResult = await CloudinaryProvider.streamUpload(
        userAvatarFile.buffer,
        "meo-users"
      );

      updateUser = await userModel.update(userId, {
        avatar: uploadResult.secure_url,
      });
    } else {
      updateUser = await userModel.update(userId, {
        displayName: reqBody.displayName,
      });
    }

    return pickUser(updateUser);
  } catch (error) {
    throw error;
  }
};

export const userService = {
  createNew,
  verifyAccount,
  login,
  refreshToken,
  update,
};
