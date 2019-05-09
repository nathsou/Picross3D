export type EventHandler = (e: any) => void;

export default abstract class EventEmitter<EventName = string> {

    private event_handlers: Map<EventName, EventHandler[]>;

    constructor() {
        this.event_handlers = new Map<EventName, EventHandler[]>();
    }

    public on(ev: EventName, handler: EventHandler): void {
        if (!this.isListening(ev)) {
            this.event_handlers.set(ev, []);
        }

        this.event_handlers.get(ev).push(handler);
    }

    protected isListening(ev: EventName): boolean {
        return this.event_handlers.has(ev);
    }

    protected emit(ev: EventName, value?: any, thisArg?: any): void {
        if (this.isListening(ev)) {
            for (const handler of this.event_handlers.get(ev)) {
                handler.call(thisArg, value);
            }
        }
    }

    protected bindEvent(em: EventEmitter<EventName>, ev: EventName): void {
        em.on(ev, value => this.emit(ev, value));
    }

    public removeListener(ev: EventName): void {
        this.event_handlers.delete(ev);
    }

    public removeListeners(): void {
        this.event_handlers.clear();
    }
}