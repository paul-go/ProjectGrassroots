
namespace Cover
{
	/** */
	export async function coverOutput()
	{
		await App.createApp({ shell: true, clear: true });
		const [blog, friendlyName] = await Sample.createBlog();
		const posts = [Sample.createPost("")];
		
		for (let i = -1; ++i < 9;)
			posts.push(Sample.createPost());
		
		await Promise.all(posts.map(p => blog.retainPost(p)));
		
		// The player JS files (both the minified and the unminified)
		// are written to build directory, rather than directly to the
		// export folder, because the publisher pulls the player JS
		// file from the this folder before copying it to the output
		// folder.
		await Cover.emitPlayerJs(Dir.build, new Defs());
		
		const publisher = new App.DevicePublisher(blog);
		publisher.folder = getExportsFolder(friendlyName);
		await publisher.tryPublish();
		
		Cover.log("Done");
	}
}
