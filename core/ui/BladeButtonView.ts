
namespace Turf
{
	export interface IBladeButtonViewOptions
	{
		selectable?: boolean;
		unselectable?: boolean;
		independent?: boolean;
	}
	
	/** */
	export class BladeButtonView
	{
		static readonly auxiliary = "•••";
		
		/** */
		constructor(text: string, options?: IBladeButtonViewOptions)
		{
			this.isSelectable = options?.selectable ?? true;
			this.isUnselectable = options?.unselectable ?? true;
			this.isIndependent = options?.independent ?? false;
			
			this.root = Htx.div(
				UI.clickable,
				{
					tabIndex: 0,
					display: "inline-block",
					whiteSpace: "nowrap",
					padding: "30px 20px",
					fontWeight: "600",
					fontSize: "20px",
					transitionDuration: "0.2s",
					transitionProperty: "opacity",
				},
			);
			
			this.text = text;
			
			if (this.isSelectable)
			{
				this.root.addEventListener(UI.click, ev =>
				{
					ev.preventDefault();
					const wasSelected = this.selected;
					this.selected = this.isUnselectable ? !this.selected : true;
					
					if (this.selected && !wasSelected)
						for (const fn of this.selectedHandlers)
							fn();
				});
			}
			
			Controller.set(this);
		}
		
		readonly root;
		
		private readonly isSelectable: boolean;
		private readonly isUnselectable: boolean;
		private readonly isIndependent: boolean;
		
		/** */
		get text()
		{
			return this.root.textContent || "";
		}
		set text(value: string)
		{
			this.root.textContent = value;
		}
		
		/** */
		get visible()
		{
			return this.root.style.display !== "none";
		}
		set visible(visible: boolean)
		{
			this.root.style.display = visible ? "block" : "none";
			this.fadeIndicator(visible);
		}
		
		/** */
		get enabled()
		{
			return this._enabled;
		}
		set enabled(value: boolean)
		{
			this._enabled = value;
			const s = this.root.style;
			s.pointerEvents = value ? "all" : "none";
			s.opacity = value ? "1" : "0.33";
			this.fadeIndicator(value);
		}
		private _enabled = true;
		
		/** */
		get selected()
		{
			return this._selected;
		}
		set selected(value: boolean)
		{
			if (this._selected === value)
				return;
			
			const wasSelected = this._selected;
			const siblings = Query.siblings(this.root);
			const siblingButtons = Controller.map(siblings, BladeButtonView);
			siblingButtons.map(button => button._selected = false);
			this._selected = value;
			
			const indicator = this.getIndicator();
			
			if (!wasSelected && value)
			{
				const left = this.isIndependent ? 0 : this.root.offsetLeft;
				const width = this.root.offsetWidth;
				indicator.style.left = left + "px";
				indicator.style.width = width + "px";
			}
			
			this.fadeIndicator(value);
		}
		private _selected = false;
		
		/** */
		private getIndicator()
		{
			if (this._indicator)
				return this._indicator;
			
			if (this.isIndependent)
			{
				this.root.append(this._indicator = this.createIndicator());
			}
			else
			{
				const siblings = Query.siblings(this.root);
				this._indicator = siblings.find(e => e.classList.contains(Class.indicator)) || null;
				if (!this._indicator)
					this.root.parentElement!.prepend(this._indicator = this.createIndicator());
			}
			
			return this._indicator;
		}
		
		/** */
		private fadeIndicator(value: boolean)
		{
			if (this._indicator && this._selected)
				this._indicator.style.opacity = value ? "1" : "0";
		}
		
		/** */
		private createIndicator()
		{
			return Htx.div(
				Class.indicator,
				{
					position: "absolute",
					top: "0",
					height: "3px",
					opacity: "0",
					backgroundColor: "rgb(128, 128, 128)",
					transitionProperty: "left, width, opacity",
					transitionDuration: "0.2s",
				}
			);
		}
		
		private _indicator: HTMLElement | null = null;
		
		/** */
		setAction(fn: () => void)
		{
			
		}
		
		/** */
		onSelected(fn: () => void)
		{
			this.selectedHandlers.push(fn);
		}
		private readonly selectedHandlers: (() => void)[] = [];
	}
	
	/** */
	const enum Class
	{
		indicator = "indicator"
	}
}
