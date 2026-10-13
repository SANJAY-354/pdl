type EventHandler = (data: any) => void;

class WebSocketClient {
  private socket: WebSocket | null = null;
  private handlers: Map<string, EventHandler[]> = new Map();
  private reconnectInterval = 3000;
  private url: string;

  constructor() {
    const wsProto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsHost = import.meta.env.VITE_WS_HOST || 'localhost:8000';
    this.url = `${wsProto}//${wsHost}/ws/queue`;
  }

  connect() {
    try {
      this.socket = new WebSocket(this.url);

      this.socket.onopen = () => {
        console.log('[WebSocket] Connected to MediFlow Queue Stream');
      };

      this.socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          const { type, data } = payload;
          const registered = this.handlers.get(type) || [];
          registered.forEach((handler) => handler(data));
        } catch (e) {
          console.error('[WebSocket] Message parse error:', e);
        }
      };

      this.socket.onclose = () => {
        setTimeout(() => this.connect(), this.reconnectInterval);
      };

      this.socket.onerror = () => {
        this.socket?.close();
      };
    } catch {
      setTimeout(() => this.connect(), this.reconnectInterval);
    }
  }

  on(eventType: string, handler: EventHandler) {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    this.handlers.get(eventType)?.push(handler);
  }

  off(eventType: string, handler: EventHandler) {
    const registered = this.handlers.get(eventType) || [];
    this.handlers.set(eventType, registered.filter((h) => h !== handler));
  }
}

export const wsClient = new WebSocketClient();
