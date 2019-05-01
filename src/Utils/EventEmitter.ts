export type EventHandler = (e: any) => void;

export default abstract class EventEmitter {

    event_handlers: Map<string, EventHandler[]>;

    constructor() {
        this.event_handlers = new Map<string, EventHandler[]>();
    }

    public on(ev: string, handler: EventHandler): void {
        if (!this.isListening(ev)) {
            this.event_handlers.set(ev, []);
        }

        this.event_handlers.get(ev).push(handler);
    }

    protected isListening(ev: string): boolean {
        return this.event_handlers.has(ev);
    }

    protected emit(ev: string, value?: any, thisArg?: any): void {
        if (this.isListening(ev)) {
            for (const handler of this.event_handlers.get(ev)) {
                handler.call(thisArg, value);
            }
        }
    }

    protected bindEvent(em: EventEmitter, ev: string): void {
        em.on(ev, value => this.emit(ev, value));
    }

    public removeListener(ev: string): void {
        this.event_handlers.delete(ev);
    }

    public removeListeners(): void {
        this.event_handlers.clear();
    }
}