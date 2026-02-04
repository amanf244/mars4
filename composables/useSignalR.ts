import * as signalR from '@microsoft/signalr'

let connection: signalR.HubConnection | null = null

export const useSignalR = () => {
  const connect = async () => {
    // jangan jalan di server (SSR)
    if (import.meta.server) return null
    if (connection) return connection

    const config = useRuntimeConfig()
    const apiBase = config.public.apiBase || 'http://localhost:5084/api/v1'
    const apiRoot = apiBase.replace(/\/api\/v1\/?$/, '')

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
