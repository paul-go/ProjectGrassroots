
namespace App
{
	/** */
	export class HtmlFile
	{
		/** */
		title = "";
		
		/** */
		language = "en-us";
		
		/** */
		customHeaderHtml = "";
		
		/** */
		customFooterHtml = "";
		
		/** */
		minify = false;
		
		/** */
		formatAsXml = false;
		
		/** */
		addInlineCss(cssText: string)
		{
			this.cssTextParts.push(cssText);
		}
		private cssTextParts: string[] = [];
		
		/** */
		emit(elements: HTMLElement | HTMLElement[], folderDepth = 0)
		{
			elements = Array.isArray(elements) ? elements : [elements];
			const em = new Emitter(this.minify, this.formatAsXml);
			this.emitUpperHtml(em, folderDepth);
			this.emitStoryHtml(em, elements);
			this.emitLowerHtml(em);
			return em.toString();
		}
		
		/** */
		private emitUpperHtml(em: Emitter, folderDepth: number)
		{
			const nocache = this.minify ? "" : "?" + Date.now();
			const relative = "../".repeat(folderDepth);
			
			em.line("<!DOCTYPE html>");
			em.tag("html", { lang: this.language });
			
			if (this.title)
				em.tag("title", {}, this.title);
			
			em.tag("meta", { charset: "utf-8" });
			em.tag("meta", { name: "theme-color", content: "#000000" });
			em.tag("meta", {
				name: "viewport",
				content: "width=device-width, initial-scale=1, user-scalable=no"
			});
			em.tag("meta", {
				name: "apple-mobile-web-app-capable",
				content: "yes"
			});
			
			em.tag("link", {
				rel: "stylesheet",
				type: "text/css",
				href: relative + ConstS.cssFileNameGeneral + nocache,
			});
			
			em.tag("script", { src: relative + ConstS.jsFileNamePlayer + nocache });
			
			if (this.cssTextParts.length > 0)
			{
				em.open("style");
				em.lines(...this.cssTextParts);
				em.close("style");
			}
			
			if (this.customHeaderHtml)
				em.line(this.customHeaderHtml);
		}
		
		/** */
		private emitStoryHtml(em: Emitter, elements: HTMLElement[])
		{
			const recurse = (e: HTMLElement) =>
			{
				const attributesTable: Literal<string, string | number> = {};
				const name = e.tagName.toLowerCase();
				
				for (const attribute of Array.from(e.attributes))
				{
					if (attribute.name === "class")
					{
						const classes = Array.from(e.classList).join(" ");
						attributesTable["class"] = classes;
					}
					else
					{
						attributesTable[attribute.name] = attribute.value;
					}
				}
				
				if (e.childElementCount === 0)
				{
					em.tag(name, attributesTable, e.textContent || "");
				}
				else
				{
					em.open(name, attributesTable);
					em.indent();
					
					for (const child of Array.from(e.childNodes))
					{
						if (child instanceof Text && child.nodeValue)
						{
							em.line(child.nodeValue);
						}
						else if (child instanceof HTMLElement)
						{
							// Avoid emitting custom elements
							if (!child.tagName.includes("-"))
								recurse(child);
						}
					}
					
					em.outdent();
					em.close(name);
				}
			}
			
			for (const e of elements)
				recurse(e);
		}
		
		/** */
		private emitLowerHtml(em: Emitter)
		{
			if (this.customFooterHtml)
				em.line(this.customFooterHtml);
			
			em.close("html");
		}
	}
}
