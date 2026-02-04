import * as signalR from '@microsoft/signalr'

let connection: signalR.HubConnection | null = null

export const useSignalR = () => {
  const config = useRuntimeConfig()
  const apiBase = config.public.apiBase || 'http://localhost:5084/api/v1'

  // root = https://api.mars4.my.id
  const apiRoot = apiBase.replace(/\/api\/v1\/?$/, '')

  const connect = async () => {
    if (connection) return connection

    connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiRoot}/hubs/products`)
      .withAutomaticReconnect()
      .build()

    try {
      await connection.start()
      console.log('SignalR Connected')
      return connection
    } catch (err) {
      console.error('SignalR Connection Error:', err)
      return null
    }
  }

  const disconnect = async () => {
    if (connection) {
      await connection.stop()
      connection = null
    }
  }

  return {
    connect,
    disconnect
  }
}
