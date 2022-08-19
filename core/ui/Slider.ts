
namespace App
{
	/** */
	export class Slider
	{
		/** */
		constructor(...params: Htx.Param[])
		{
			this.root = Htx.div(
				{
					height: (thumbSize + thumbPadding * 2) + "px",
					padding: thumbPadding + "px",
					boxShadow: "inset 0 0 0 5px " + UI.white(0.15),
					borderRadius: "1000px",
				},
				Htx.on("pointerdown", ev => this.startDrag(ev)),
				Htx.on("pointerup", ev => this.endDrag(ev)),
				Htx.on("pointercancel", ev => this.endDrag(ev)),
				Htx.on("pointermove", ev =>
				{
					this.handlePointerMove(ev);
				}),
				this.slideArea = Htx.div(
					"slide-area",
					UI.anchor(),
					{
						left: (thumbSize / 2 + thumbPadding) + "px",
						right: (thumbSize / 2 + thumbPadding) + "px",
					},
					Htx.css("&:before, &:after", {
						margin: "auto",
						fontWeight: "600",
						fontSize: "1.25em",
						opacity: "0.33",
						height: "fit-content",
					}),
					Htx.css(":before", {
						content: `attr(data-left-label)`,
						...UI.anchorLeft(),
					}),
					Htx.css(":after", {
						content: `attr(data-right-label)`,
						...UI.anchorRight(),
					}),
					this.thumb = Htx.div(
						"thumb",
						UI.clickable,
						UI.flexCenter,
						{
							position: "absolute",
							top: thumbPadding + "px",
							left: "50%",
							transform: "translateX(-50%)",
							width: thumbSize + "px",
							height: thumbSize + "px",
							borderRadius: "100%",
							boxShadow: "inset 0 0 0 4px white",
							color: "white",
							fontWeight: "900",
						}
					)
				),
				...params
			);
			
			setTimeout(() => this.updateThumb());
			Cage.set(this);
		}
		
		readonly root;
		private readonly slideArea;
		private readonly thumb;
		
		private sliderRect: DOMRect | null = null;
		
		/** */
		private startDrag(ev: PointerEvent)
		{
			if (ev.buttons === 1)
			{
				this.root.setPointerCapture(ev.pointerId);
				this.sliderRect = this.slideArea.getBoundingClientRect();
			}
		}
		
		/** */
		private endDrag(ev: PointerEvent)
		{
			this.root.releasePointerCapture(ev.pointerId);
			this.sliderRect = null;
		}
		
		/** */
		setLeftLabel(label: string)
		{
			this.slideArea.setAttribute("data-left-label", label);
		}
		
		/** */
		setRightLabel(label: string)
		{
			this.slideArea.setAttribute("data-right-label", label);
		}
		
		/** */
		get min()
		{
			return this._min;
		}
		set min(value: number)
		{
			this._min = value;
			this.updateThumb();
		}
		private _min = 0;	
		
		/** */
		get max()
		{
			return this._max;
		}
		set max(value: number)
		{
			this._max = value;
			this.updateThumb();
		}
		private _max = 100;
		
		/** */
		get place()
		{
			return this._place;
		}
		set place(value: number)
		{
			this._place = Math.max(this.min, Math.min(this.max, value));
			this.updateThumb();
		}
		private _place = 50;
		
		/** */
		get decimals()
		{
			return this._decimals;
		}
		set decimals(decimals: number)
		{
			this._decimals = Math.max(0, decimals);
			this.updateThumb();
		}
		private _decimals = 1;
		
		/** */
		private handlePointerMove(ev: PointerEvent)
		{
			this.root.style.cursor = ev.buttons === 1 ? "pointer" : "default";
			
			if (this.sliderRect === null)
				return;
			
			const xPixel = Math.max(0, Math.min(this.sliderRect.width, ev.clientX - this.sliderRect.x));
			const xPercent = xPixel / this.sliderRect.width;
			const range = this.max - this.min;
			this._place = (xPercent * range) + this.min;
			
			this.updateThumb();
			this.progressChangeFn();
		}
		
		/** */
		private updateThumb()
		{
			const range = this.max - this.min;
			const cssLeftAmount = (this.place - this.min) / range * 100;
			this.thumb.style.left = cssLeftAmount + "%";
			const power = this.decimals ? 10 ** this.decimals : 1;
			this.thumb.textContent = (Math.round(this.place * power) / power).toString();
		}
		
		/** */
		setProgressChangeFn(fn: () => void)
		{
			this.progressChangeFn = fn;
		}
		private progressChangeFn = () => {};
	}
	
	const thumbSize = 60;
	const thumbPadding = 8;
}
