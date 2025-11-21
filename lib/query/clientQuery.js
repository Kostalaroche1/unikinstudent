
/**
 * 
 * @param {string} urlQuery url to api
 * @returns {object}
 */
export const getQuery = async (urlQuery) => {
    const res = await fetch(urlQuery, {
        method: "GET",
        headers: { "content-type": "applicaion/json" },
        next: { revalidate: 10 }
    })
    return await res.json()
}

/**
 * 
 * @param {string} urlQuery path or url to api 
 * @param {object} bodyData data to send to api
 * @returns 
 */
export const postQuery = async (urlQuery, bodyData = {}) => {
    const res = await fetch(urlQuery, {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: JSON.stringify(bodyData),
        next: { revalidate: 10 }
    })
    return await res.json()
}

/**
 * 
 * @param {string} urlQuery path or url to api 
 * @param {object} bodyData data to send to api
 * @returns {object}
 */
export const postQueryData = async (urlQuery, bodyData) => {
    const res = await fetch(urlQuery, {
        headers: { "content-type": "application/json" },
        method: "POST",
        body: bodyData,
        next: { revalidate: 10 }
    })
    return await res.json()
}

/**
 * 
 * @param {string} urlQuery path or url to api
 * @param {Object} bodyData json data
 * @param {string} credentialsDel credential like include default credential is omit
 * @returns {object}
 */
export const deleteQuery = async (urlQuery, bodyData, credentialsDel = 'omit') => {
    const res = await fetch(urlQuery,
        {
            headers: { "content-type": "application/json" },
            method: "DELETE",
            body: JSON.stringify(bodyData),
            next: { revalidate: 10 },
            credentials: credentialsDel
        }
    )
    return await res.json()
}

/**
 * 
 * @param {string} urlQuery url or path of api
 * @param {Object} bodyData json data to send
 * @returns {object}
 */
export const putQuery = async (urlQuery, bodyData = {}) => {
    const res = await fetch(urlQuery, {
        headers: { "content-type": "application/json" },
        method: "PUT",
        body: JSON.stringify(bodyData),
        next: { revalidate: 10 }
    })
    return await res.json()
}