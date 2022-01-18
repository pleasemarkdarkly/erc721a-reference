import "hardhat/types/config";
import "hardhat/types/runtime";

declare module "hardhat/types/config" {
    // This is an example of an extension to one of the Hardhat config values.

    // We extend the UserConfig type, which represents the config as writen
    // by the users. Things are normally optional here.
    export interface ProjectPathsUserConfig {
        newPath?: string;
    }

    // We also extend the Config type, which represents the configuration
    // after it has been resolved. This is the type used during the execution
    // of tasks, tests and scripts.

    // Normally, you don't want things to be optional here. As you can apply
    // default values using the extendConfig function.
    export interface ProjectPathsConfig {
        newPath: string;
    }
}