
namespace Turf
{
	/** */
	export class PatchView
	{
		/** */
		constructor(readonly record = new PatchRecord())
		{
			const minHeight: Htx.Param = { minHeight: "85vh" };
			
			this.root = Htx.div(
				"patch-view",
				{
					paddingBottom: "10px",
				},
				minHeight,
				this.bladesElement = Htx.div(
					"blades-element",
					minHeight,
					Htx.p(
						"no-blades-message",
						UI.visibleWhenAlone(),
						UI.anchor(),
						UI.flexCenter,
						minHeight,
						{
							zIndex: "1",
						},
						Htx.div(
							"add-first-blade",
							Htx.div(
								{
									fontSize: "30px",
									fontWeight: "600",
									marginBottom: "30px",
								},
								new Text("This patch has no blades."),
							),
							UI.actionButton("filled", 
								{
									marginTop: "10px",
								},
								Htx.on(UI.click, async () =>
								{
									const bladeView = await AddBladeView.show(this.root);
									if (bladeView)
										this.bladesElement.append(bladeView.root);
								}),
								new Text("Add One"),
							)
						),
					),
				),
				
				this.footerElement = Htx.div(
					"footer",
					{
						margin: "auto",
						maxWidth: "400px",
						padding: "20px",
					},
					UI.actionButton("filled", 
						new Text("Preview"),
						Htx.on("click", () =>
						{
							const apex = Controller.over(this, ApexView);
							const meta = apex.currentMeta;
							new PreviewView(record, meta);
						})
					)
				)
			);
			
			this.blades = new Controller.Array(this.bladesElement, BladeView);
			this.blades.observe(() =>
			{
				this.footerElement.style.display = this.blades.length > 0 ? "block" : "none";
				
				this.record.blades = this.blades
					.toArray()
					.map(view => view.record);
			});
			
			Controller.set(this);
		}
		
		readonly root;
		readonly blades;
		private readonly bladesElement;
		private readonly footerElement;
	}
}
