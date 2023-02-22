//In this file we're going to extend the global ProcessEnv interface
declare global {
    namespace NodeJS{
        interface ProcessEnv {
            PORT:Number | String,
            PRIVATE_KEY:String | undefined
        }
    }
}

export {} //Convert file to a module