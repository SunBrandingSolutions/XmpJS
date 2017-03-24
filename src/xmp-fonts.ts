/// <reference path="xmp.ts" />

namespace XmpJS {
    /**
     * Defines information about a font stored in XMP.
     */
    export interface IXmpFontInfo {
        /** The font family. */
        family: string;
        /** The font face. */
        face: string;
        /** The font type. */
        type?: string;
        /** The font name. */
        name: string;
        /** The font version. */
        version?: string;
        /** The filename of the font. */
        fileName?: string;
    }

    /**
     * Extracts all font definitions in an XMP document.
     * @param xmp XmpDocument to load fonts from.
     */
    export function getFonts(xmp: XmpDocument): Array<IXmpFontInfo> {
        const XPATH_EXPR: string = "//rdf:RDF/rdf:Description/xmpTPg:Fonts/rdf:Bag/rdf:li";

        return mapElements(xmp, XPATH_EXPR, (node: Node): IXmpFontInfo => {
            return null;
        });
    }
}