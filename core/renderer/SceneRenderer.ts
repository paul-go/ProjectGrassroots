
namespace App
{
	/**
	 * 
	 */
	export abstract class SceneRenderer<TScene extends SceneRecord>
	{
		/** */
		static new<TScene extends SceneRecord>(scene: TScene, isPreview = true)
		{
			if (scene instanceof CanvasSceneRecord)
				return new CanvasSceneRenderer(scene, isPreview);
					
			if (scene instanceof GallerySceneRecord)
				return new GallerySceneRenderer(scene, isPreview);
			
			if (scene instanceof ProseSceneRecord)
				return new ProseSceneRenderer(scene, isPreview);
			
			Not.reachable();
		}
		
		/** */
		protected constructor(
			protected readonly scene: TScene,
			protected readonly isPreview: boolean)
		{
			this.colors = RenderUtil.resolveColors(this.scene);
		}
		
		/**
		 * A reference to the object that is responsible for CSS class generation.
		 * Can be swapped in/out for a different class generator with a different
		 * starting point.
		 */
		classGenerator = new CssClassGenerator();
		
		/**
		 * Gets the list of CSS rules that have been generated by this SceneRenderer.
		 */
		readonly cssRules: (Css.VirtualCssMediaQuery | Css.VirtualCssRule)[] = [];
		
		/** */
		protected readonly colors;
		
		/** */
		protected getMediaUrl(media: MediaRecord, css?: "css")
		{
			if (this.isPreview)
				return css ? media.getBlobCssUrl() : media.getBlobUrl();
			
			const url = media.getHttpUrl();
			return css ? `url(${url})` : url;
		}
		
		/** */
		protected useAnimation(animationName: string)
		{
			const animation = Animation.fromName(animationName);
			this.usedTransitions.add(animation);
			return animationName;
		}
		
		private readonly usedTransitions = new Set<Animation>();
		
		/** */
		async render()
		{
			const contents = await this.renderContents();
			
			return Hot.section(
				CssClass.scene,
				{
					color: this.colors.foregroundUncolored,
					backgroundColor: this.scene.hasColor ?
						this.colors.backgroundColored :
						this.colors.backgroundUncolored,
					height: "100vh",
					data: {
						[DataAttributes.transition]: this.useAnimation(this.scene.transition)
					}
				},
				contents
			);
		}
		
		/** */
		protected abstract renderContents(): Hot.Param | Promise<Hot.Param>;
	}
}
