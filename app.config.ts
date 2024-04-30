import {ExpoConfig, ConfigContext} from 'expo/config'

import 'dotenv/config'

export default ({config}: ConfigContext): ExpoConfig => {
    if (!config.android) {
        config.android = {}
    }

    config.android.googleServicesFile = process.env.GOOGLE_SERVICES_JSON

    return config as ExpoConfig
}
