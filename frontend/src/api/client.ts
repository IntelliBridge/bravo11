import config from '../config'
import { createApiClient } from '../utils/createApiClient'

const apiClient = createApiClient(`${config.apiBaseUrl}/api/v1`, { 'Content-type': 'application/json' })

export default apiClient
