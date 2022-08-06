
namespace App
{
	/** */
	export class S3Publisher extends Publisher
	{
		/** */
		constructor(post: PostRecord, meta: MetaRecord)
		{
			super(post, meta);
			
			this.root = Htx.div(
				"s3-publisher",
				{
					padding: "60px 0",
					textAlign: "center",
					fontStyle: "italic",
					fontSize: "22px",
					opacity: "0.66",
					border: "1px solid " + UI.black(0.25),
					borderRadius: UI.borderRadius.default,
				},
				...UI.text("Coming soon")
			)
		}
		
		readonly root;
		readonly key = "s3";
		readonly label = "My Server";
		
		/** */
		get host()
		{
			return this.meta.getPublishParam(this.key, "host", "");
		}
		set host(host: string)
		{
			this.setPublishParam("host", host);
		}
		
		/** */
		get accessKey()
		{
			return this.meta.getPublishParam(this.key, "accessKey", "");
		}
		set accessKey(accessKey: string)
		{
			this.setPublishParam("accessKey", accessKey);
		}
		
		/** */
		get secretKey()
		{
			return this.meta.getPublishParam(this.key, "secretKey", "");
		}
		set secretKey(secretKey: string)
		{
			this.setPublishParam("secretKey", secretKey);
		}
		
		/** */
		getPublishDestinationUI(): Htx.Param
		{
			return this.host && this.accessKey && this.secretKey ?
				new Text(this.host) :
				null;
		}
		
		/** */
		protected async executePublish(files: IRenderedFile[])
		{
			return "";
		}
	}
	
	setTimeout(() =>
	{
		Publisher.register(S3Publisher, 1);
	});
}
