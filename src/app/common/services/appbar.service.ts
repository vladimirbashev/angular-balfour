import { Injectable } from '@angular/core';

export class AppbarServiceIcon {
    name: string;
    icon: string;
    callback: () => void;
}

export class AppbarServiceAction {
    name: string;
    icon: string;
    tooltip: string;
    in_progress: boolean;
    action: () => void;
}

@Injectable()
export class AppbarService {
    private _icons: AppbarServiceIcon[] = [];
    private _actions: AppbarServiceAction[] = [];
    private _title: string = null;
    private _idx = -1;

    public get icon(): AppbarServiceIcon | null {
        return this._idx >= 0 ? this._icons[this._idx] : null;
    }

    public get title(): string {
        return this._title;
    }

    public set title(title: string) {
        setTimeout(() => {
            this._title = title;
        });
    }

    public resetTitle() {
        this._title = null;
    }

    public registerIcon(icon: AppbarServiceIcon, select = false): void {
        if (!this._icons.some(i => i.name === icon.name)) {
            this._icons.push(icon);
            if (select) {
                this._idx = this._icons.length - 1;
            }
        }
    }

    public degeristerIcon(name: string): void {
        const idx = this._icons.findIndex(i => i.name === name);
        if (idx >= 0) {
            this._icons.splice(idx, 1);
            if (this._icons.length < 1) {
                this._idx = -1;
            }
        }
    }

    public selectByIndex(idx: number): void {
        setTimeout(() => {
            if (idx >= 0 && idx < this._icons.length) {
                this._idx = idx;
            }
        });
    }

    public selectByName(name: string): void {
        setTimeout(() => {
            const idx = this._icons.findIndex(i => i.name === name);
            if (idx >= 0) {
                this._idx = idx;
            }
        });
    }

    public get actions(): AppbarServiceAction[] {
        return this._actions;
    }

    public registerAction(action: AppbarServiceAction, select = false): void {
        if (!this._actions.some(a => a.name === action.name)) {
            this._actions.push(action);
        }
    }

    public deregisterAction(name: string): void {
        const idx = this._actions.findIndex(a => a.name === name);
        if (idx >= 0) {
            this._actions.splice(idx, 1);
        }
    }

    public resetActions() {
        this._actions = [];
    }

    public selectActionByName(name: string): AppbarServiceAction {
        const idx = this._actions.findIndex(a => a.name === name);
        if (idx >= 0) {
            return this._actions[idx];
        } else return null;
    }
}
