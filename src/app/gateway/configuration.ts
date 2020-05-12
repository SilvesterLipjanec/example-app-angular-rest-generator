
/** Type definitions **/
export interface MethodConfig {
    [method: string]: {
        consume: string;
        accept: string;
        reportProgress: boolean,
        withCredentials: boolean,
    }
}

export interface ConfigOptions { 
    [method: string]: {
        consume?: string[];
        accept?: string[];
    }
}

export interface ApiKeys {
    [name: string]: string;
}

/** Definition of available options **/

export const apiEndpoints = [
    "https://petstore.swagger.io/v2",
    "http://petstore.swagger.io/v2",
];

export const configOptions: ConfigOptions = {
    updatePet: {
        consume: [ 'text/plain', ],
    },

    addPet: {
        consume: [ 'application/json', 'application/xml', ],
    },

    findPetsByStatus: {
        accept: [ 'application/xml', 'application/json', ]
    },

    findPetsByTags: {
        accept: [ 'application/xml', 'application/json', ]
    },

    getPetById: {
        accept: [ 'application/xml', 'application/json', ]
    },

    updatePetWithForm: {
        consume: [ 'application/x-www-form-urlencoded', ],
    },

    uploadFile: {
        consume: [ 'multipart/form-data', ],
        accept: [ 'application/json', ]
    },

    getInventory: {
        accept: [ 'application/json', ]
    },

    placeOrder: {
        consume: [ '*/*', ],
        accept: [ 'application/xml', 'application/json', ]
    },

    getOrderById: {
        accept: [ 'application/xml', 'application/json', ]
    },

    createUser: {
        consume: [ '*/*', ],
    },

    createUsersWithArrayInput: {
        consume: [ '*/*', ],
    },

    createUsersWithListInput: {
        consume: [ '*/*', ],
    },

    loginUser: {
        accept: [ 'application/xml', 'application/json', ]
    },

    getUserByName: {
        accept: [ 'application/xml', 'application/json', ]
    },

    updateUser: {
        consume: [ '*/*', ],
    },

}

/** ENTER YOUR INITIAL CONFIGURATION OPTIONS HERE **/
export const methodConfig: MethodConfig = {
    updatePet: {
        consume: configOptions.updatePet.consume[0],
        accept: null,
        reportProgress: false,
        withCredentials: false
    },

    addPet: {
        consume: configOptions.addPet.consume[0],
        accept: null,
        reportProgress: false,
        withCredentials: false
    },

    findPetsByStatus: {
        consume: null,
        accept: configOptions.findPetsByStatus.accept[0],
        reportProgress: false,
        withCredentials: false
    },

    findPetsByTags: {
        consume: null,
        accept: configOptions.findPetsByTags.accept[0],
        reportProgress: false,
        withCredentials: false
    },

    getPetById: {
        consume: null,
        accept: configOptions.getPetById.accept[0],
        reportProgress: false,
        withCredentials: false
    },

    updatePetWithForm: {
        consume: configOptions.updatePetWithForm.consume[0],
        accept: null,
        reportProgress: false,
        withCredentials: false
    },

    deletePet: {
        consume: null,
        accept: null,
        reportProgress: false,
        withCredentials: false
    },

    uploadFile: {
        consume: configOptions.uploadFile.consume[0],
        accept: configOptions.uploadFile.accept[0],
        reportProgress: false,
        withCredentials: false
    },

    getInventory: {
        consume: null,
        accept: configOptions.getInventory.accept[0],
        reportProgress: false,
        withCredentials: false
    },

    placeOrder: {
        consume: configOptions.placeOrder.consume[0],
        accept: configOptions.placeOrder.accept[0],
        reportProgress: false,
        withCredentials: false
    },

    getOrderById: {
        consume: null,
        accept: configOptions.getOrderById.accept[0],
        reportProgress: false,
        withCredentials: false
    },

    deleteOrder: {
        consume: null,
        accept: null,
        reportProgress: false,
        withCredentials: false
    },

    createUser: {
        consume: configOptions.createUser.consume[0],
        accept: null,
        reportProgress: false,
        withCredentials: false
    },

    createUsersWithArrayInput: {
        consume: configOptions.createUsersWithArrayInput.consume[0],
        accept: null,
        reportProgress: false,
        withCredentials: false
    },

    createUsersWithListInput: {
        consume: configOptions.createUsersWithListInput.consume[0],
        accept: null,
        reportProgress: false,
        withCredentials: false
    },

    loginUser: {
        consume: null,
        accept: configOptions.loginUser.accept[0],
        reportProgress: false,
        withCredentials: false
    },

    logoutUser: {
        consume: null,
        accept: null,
        reportProgress: false,
        withCredentials: false
    },

    getUserByName: {
        consume: null,
        accept: configOptions.getUserByName.accept[0],
        reportProgress: false,
        withCredentials: false
    },

    updateUser: {
        consume: configOptions.updateUser.consume[0],
        accept: null,
        reportProgress: false,
        withCredentials: false
    },

    deleteUser: {
        consume: null,
        accept: null,
        reportProgress: false,
        withCredentials: false
    },

}

export const apiKeys: ApiKeys = {
    api_key: null,
}
export const bearerToken = null; 
export const basicToken = null; 
export const apiEndpoint = apiEndpoints[0];