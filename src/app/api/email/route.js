import { NextResponse } from "next/server"
import nodemailer from "nodemailer"
import { connectionDatabase } from "../../../../lib/database"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"


export const POST = async (req) => {
    const { userEmail, subject, text, user } = await req.json()
    const dataSendMailCheck = await sendMailCode(userEmail, subject, text, user)
    if (dataSendMailCheck.status) {
        // create auth cookie
        const dataSessionAuth = { nameUser: user.name, email: userEmail, codeAuth: dataSendMailCheck.codeAuth, expiredTime: dataSendMailCheck.expiredTime }
        const authToken = jwt.sign(dataSessionAuth, process.env.JWT_SECRET_KEY_SESSIONAUTH, { expiresIn: "10m" })
        const response = NextResponse.json({ status: "ok" })
        response.cookies.set("sessionToken", authToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 10 * 60
        })
        return response
    } else {
        return NextResponse.json({ status: "error", message: "try again sommething happen" })
    }
}
// put checking
export const PUT = async (req) => {
    const { codeCheckMail } = await req.json() //take data from user
    const { nameUser, email, codeAuth, expiredTime } = await verifySessionAuthToken(process.env.JWT_SECRET_KEY_SESSIONAUTH, "sessionToken")

    console.log("name user", nameUser, "email", email);
    const dataCheckMail = await checkMailCode(codeCheckMail, codeAuth, expiredTime) //check if both codeFromUser and codeSendToUser math
    try {
        if (dataCheckMail) {
            let response

            const db = await connectionDatabase()
            const requestSelectMail = "select * from users left join subscriptions  using(id_user) where email=?"

            const [dataSelect] = await db.query(requestSelectMail, [email])
            console.log("dataSelect from users table ", dataSelect, "lenght dataselect", dataSelect.length, "name user", nameUser, "email", email);
            if (dataSelect.length < 1) {
                console.log("data from user table inside user<0", dataSelect, "", nameUser, "email", email);
                const requestInsertUser = "insert into users(name,email) value(?,?)"
                const [dataInsert] = await db.execute(requestInsertUser, [nameUser, email])
                if (dataInsert.lenght < 1) {
                    response = NextResponse.json({ status: true, message: "un probleme avec la base de données svp ressayez" })
                }
                response = NextResponse.json({ status: true, message: "votre compte a été crée" })
            }
            const [data] = await db.query(requestSelectMail, [email])

            const users = {
                name: data[0].name_user, email: data[0].email, id: data[0].id_user,
                role: data[0].role, idSub: data[0].id_sub, expireDate: data[0].expiresAt
            }

            const tokenAuthApp = jwt.sign(users, process.env.JWT_SECRET_KEY_AUTH, { expiresIn: "1y" })
            response = NextResponse.json({ status: true, message: "vous êtes connecté" })
            response.cookies.set("authToken", tokenAuthApp, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                maxAge: 24 * 60 * 60
            })
            response.cookies.delete("sessionToken")
            return response
            // return NextResponse.json({ status: true })
        } else {
            return NextResponse.json({ status: false, message: "code incorrect, introduisez un bon code" })
        }
    } catch (error) {
        console.log("error ", error)
        return NextResponse.json({ status: false })
    }
}

/**
 * 
 * @param {string} userEmail mail from user field 
 * @param {number} idUserConnected id user enter email for verification
 * @param {number} subject subject about mail
 * @param {number} text message explain mail
 * @returns {promise<boolean>}
 */
export const sendMailCode = async (userEmail, subject, text, user, keepCode = true) => {

    const verificationCode = parseInt(Math.random() * 100000).toFixed()
    const expireTimeCheckMail = new Date(Date.now() + 5 * 60 * 1000)
    // console.log(user, ' user inside send mailer', text)
    const verificationLink = `http://192.168.33.239:3000/auth/?code=${verificationCode}&email=${encodeURIComponent(userEmail)}`;

    const cardUser = ` <div style="max-width: 600px; margin: auto; border: 1px solid #ddd; 
    border-radius: 5px; overflow: hidden; font-family: Arial, sans-serif;">
      <div style="background-color: #f8f9fa; padding: 15px; text-align: center;">
        <h3 style="margin: 0; color: #343a40;">Bienvenu A Bietu</h3>
      </div>
      <div style="padding: 20px;">
        <img src="${user ? user.image : ""}" alt="User Photo" style="display: block; margin: 0 auto 15px; 
        border-radius: 50%; width: 100px; height: 100px; object-fit: cover;">
        <h4 style="text-align: center; margin: 10px 0;">Bienvenue  ${user ? user.name : ""} à BIBLIOTHEQUE ONLINE votre bibliotheque le plus proche  </h4>
        <p style="text-align: center; color: #6c757d; text-alin:center;">
          ${text ? text : ""} ${keepCode ? `ton code d'authentification est <h3 style=" color:blue"> ${verificationCode}</h3>` : ""}
          nous vous remercions de collaborer avec nous. Clicquer sur le bouton ci-dessous pour finir l'enregistrement .
        </p>
        <a href="${verificationLink}" 
           style="display: block; text-align: center; background-color: #007bff; color: white;
            text-decoration: none; padding: 10px 15px; border-radius: 5px; margin: 15px auto; width: 150px;">
           Verifier maintenant
        </a>
      </div>
      <div style="background-color: #f8f9fa; padding: 10px; text-align: center; font-size: 12px; color: #6c757d;">
        <p style="margin: 0;">&copy;  Bietu company </p>
      </div>
    </div>
  `
    try {

        const transportMail = nodemailer.createTransport({
            service: "Gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.BIETU_MAIL,
                pass: process.env.BIETU_PASS_MAIL
            }
        })
        const optionsMail = {
            from: process.env.BIETU_MAIL,
            to: userEmail,
            subject: subject ? subject : `this code expire after 5 minutes `,
            html: cardUser
        }
        const resultMail = await transportMail.sendMail(optionsMail)
        return { status: true, codeAuth: verificationCode, expiredTime: expireTimeCheckMail }
    } catch (error) {
        return false
    }
}

export const sendMailContact = async (userEmail, subject, text, description, user) => {


    const cardUser = ` <div style="max-width: 600px; margin: auto; border: 1px solid #2885e2ff; 
    border-radius: 5px; overflow: hidden; font-family: Arial, sans-serif;">
      <div style="background-color: #617e9bff ; padding: 15px; text-align: center;">
        <h3 style="margin: 0; color: #f4f8fcff;">${subject}</h3>
      </div>
      <div style="padding: 20px; background-color: #a7b5c4ff;">
        <img src="${user ? user.image : ""}" alt="User Photo" style="display: block; margin: 0 auto 15px; 
        border-radius: 50%; width: 100px; height: 100px; object-fit: cover;">
        <h4 style="text-align: center; margin: 10px 0;"> ${user ? user.name : ""} 
        <p style="text-align: center; color: #181c1fff;">
          ${text} 
        </p>
         <p style="text-align: center; color: #181c1fff;">
          ${description} 
        </p>
        <p style:"color: #181c1fff ">email de contact contact est ${userEmail}</p>
      </div>
      <div style="background-color: #617e9bff; padding: 10px; text-align: center; font-size: 12px; color: #6c757d;">
        <p style="margin: 0; color : #eff3f7ff; ">&copy;  BIBLIOTHE UNIKIN EN LIGNE</p>
      </div>
    </div>
  `
    try {

        const transportMail = nodemailer.createTransport({
            service: "Gmail",
            port: 465,
            secure: true,
            auth: {
                user: process.env.BIETU_MAIL,
                pass: process.env.BIETU_PASS_MAIL
            }
        })
        // const resultVerifyServerSTMP =
        const optionsMail = {
            from: process.env.BIETU_MAIL,
            to: userEmail,
            html: cardUser
        }
        const resultMail = await transportMail.sendMail(optionsMail)
        return { status: true }
    } catch (error) {
        return false
    }
}
/**
 * 
 * @param {string} codeCheckMailFromUser 
 * @param {string} codeCheckMailSendToUser 
 * @param {Date} expiredTime 
 * * @returns {Promise<boolean,null>} 
 */
export const checkMailCode = async (codeCheckMailFromUser, codeCheckMailSendToUser, expiredTime) => {
    try {
        if (codeCheckMailFromUser !== codeCheckMailSendToUser) {
            return null
        }
        if (new Date(expiredTime).toLocaleString() < new Date(Date.now()).toLocaleString()) {
            return null

        }
        return true
    } catch (error) {
        return null
    }
}

/**
 * 
 * @param {string} jwtSecretKey 
 * @param {string} getToken 
 * @returns 
 */
export async function verifySessionAuthToken(jwtSecretKey, getToken) {
    const cookieStore = await cookies(); // ✅ Await it
    const sessionToken = cookieStore.get(getToken)?.value;
    if (!sessionToken) return null;

    try {
        return jwt.verify(sessionToken, jwtSecretKey);
    } catch (err) {
        return null;
    }
}

// get cookie
export const GET = async () => {
    try {
        const userAuth = await verifySessionAuthToken(process.env.JWT_SECRET_KEY_AUTH, "authToken")
        return NextResponse.json({ status: true, user: userAuth })
    } catch (error) {
        return NextResponse.json({ status: false })
    }
}

export async function DELETE() {
    return deleteCookie("authToken");
}
/**
 * Delete a JWT cookie (logout or clear session)
 * 
 * @param {string} cookieName - Name of the cookie to delete (default: "token")
 * @returns {NextResponse} A response with the cookie cleared
 */
export function deleteCookie(cookieName = "token") {
    const response = NextResponse.json({
        status: true,
        message: "Token cookie deleted successfully",
    });

    // Clear the cookie by setting it to empty and expired
    response.cookies.set(cookieName, "", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        expires: new Date(0), // Expire immediately
        path: "/", // So it clears from all routes
    });
    return response;
}


