
namespace App
{
	/**
	 * 
	 */
	export abstract class SceneRenderer<TScene extends SceneRecord>
	{
		/** */
		constructor(
			protected readonly root: PostRenderer,
			protected readonly scene: TScene)
		{
			this.colors = RenderUtil.resolveColors(this.scene);
		}
		
		/** */
		protected readonly colors;
		
		/** */
		protected getMediaUrl(media: MediaRecord, css?: "css")
		{
			if (this.root.isPreview)
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
			let contents = this.renderContents();
			
			if (contents instanceof Promise)
				contents = await contents;
			
			return [
				Hot.section(
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
				),
				this.renderContentsAfter(),
			];
		}
		
		/** */
		protected abstract renderContents(): Hot.Param | Promise<Hot.Param>;
		
		/** */
		protected renderContentsAfter()
		{
			return null as Hot.Param;
		}
	}
}
