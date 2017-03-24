/// <reference path="xmp.ts" />

namespace XmpJS {
    /**
     * Defines a thumbnail embedded within XMP.
     */
    export interface IXmpThumbnail {
        /** Image width in pixels */
        width: number;
        /** Image height in pixels */
        height: number;
        /** Image format */
        format: string;
        /** Base-64 encoded image data */
        image: string;
    }

    /**
     * Extracts all thumbnails from an XMP document.
     * @param xmp XMP document to parse.
     */
    export function getThumbnails(xmp: XmpDocument): Array<IXmpThumbnail> {
        let results: XPathResult = xmp.findElements("//rdf:RDF/rdf:Description/xmp:Thumbnails/rdf:Alt/rdf:li");
        let thumbnails: Array<IXmpThumbnail> = [];

        let el: Node = results.iterateNext();
        while (el) {
            if (el.hasChildNodes()) {
                let imageEl: Element = getChildElement(el, "image");
                if (imageEl) {
                    thumbnails.push({
                        image: imageEl.textContent,
                        format: getChildElement(el, "format").textContent,
                        width: parseInt(getChildElement(el, "width").textContent, 10),
                        height: parseInt(getChildElement(el, "height").textContent, 10)
                    });
                }
            } else {
                let imageAttr: Attr = el.attributes.getNamedItemNS(NAMESPACES.xmpGImg, "image");
                if (imageAttr) {
                    let format: Attr  = el.attributes.getNamedItemNS(NAMESPACES.xmpGImg, "format");
                    let width: Attr = el.attributes.getNamedItemNS(NAMESPACES.xmpGImg, "width");
                    let height: Attr  = el.attributes.getNamedItemNS(NAMESPACES.xmpGImg, "height");
                    thumbnails.push({
                        image: imageAttr.value,
                        format: format.value,
                        width: parseInt(width.value, 10),
                        height: parseInt(height.value, 10)
                    });
                }
            }

            el = results.iterateNext();
        }

        return thumbnails;
    }

    /**
     * Returns all thumbnails in the XMP as HTML-compatible image elements that
     * can be immediately inserted into the DOM. Widths and heights are automatically
     * set.
     * @param xmp XMP document to parse
     */
    export function getThumbnailImages(xmp: XmpDocument): Array<HTMLImageElement> {
        return getThumbnails(xmp).map((value: IXmpThumbnail) => {
            console.log("Rendering image element for thumbnail");

            let img: HTMLImageElement = new Image(value.width, value.height);
            img.src = `data:image/${value.format.toLowerCase()};base64,${value.image}`;
            return img;
        });
    }
}