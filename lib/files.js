import fs from "fs"
import path from "path"



/**
 *  function create folder for users files
 * @param {string} folder  is folder's created 
 * @returns 
 */
export const createFolder = (folder) => {
    folder = folder.toString().split(" ").join("_")//delete space and put this _ between
    const pathFolder = path.join(process.cwd(), "public/upload", folder)
    if (fs.existsSync(pathFolder)) {
    } else {
        fs.mkdir(pathFolder, { recursive: true },
            (errors) => {
                if (errors) {
                    // responseSideClient.json(errors)
                } else {
                    // console.log('no exist success')
                    // responseSideClient.json({ folder: "success record folder" })
                }
            })
        return folder
    }
}
/**
 * 
 * @param {string} folder verify existance of folder 
 * @returns 
 */
export const folderExist = (folder) => {
    const pathFolder = path.join(process.cwd(), "public/upload", folder)
    if (fs.existsSync(pathFolder)) {
        // console.log("folder existe")
        return true
    } else {
        return false
        // console.log(pathFolder, "no folder existe")
    }
}
export const fileExist = (folder, file) => {
    const pathFolder = path.join(process.cwd(), "public/upload", folder, file)
    if (fs.existsSync(pathFolder)) {
        // console.log(pathFolder, "file existe")
        return true
    }
    return false
}

/**
 *function delete 
 * @param {string} folder is folder's delete
 */
export const deleteFolder = (folder) => {
    const pathFolder = path.join(process.cwd(), "public/upload", folder)
    if (fs.existsSync(pathFolder)) {
        fs.rmdir(pathFolder, (errors) => {
            if (errors) {
                console.log("errors")
            } else {
                console.log("success delete folder")
            }
        })
    } else {
        console.log("impossible delete folder not exist")
    }
}
/**
 * delete file function 
 * @param {string} folder 
 * @param {string} file 
 */
export const deleteFile = (folder, file) => {
    const pathFileDelete = path.join(process.cwd(), "public/upload", folder, file)
    if (fs.existsSync(pathFileDelete)) {
        fs.unlink(pathFileDelete, (errors) => {
            if (errors) {
                console.log("error")
            } else {
                console.log("file delete with success", pathFileDelete)
            }
        })
    } else {
        console.log("impossible delete file no exist", pathFileDelete)
    }
}
