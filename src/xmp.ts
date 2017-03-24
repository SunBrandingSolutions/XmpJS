namespace XmpJS {
    export const NAMESPACES: any = {
        dc:  "http://purl.org/dc/elements/1.1/",
        illustrator:  "http://ns.adobe.com/illustrator/1.0/",
        pdf:  "http://ns.adobe.com/pdf/1.3/",
        rdf:  "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
        stDim:  "http://ns.adobe.com/xap/1.0/sType/Dimensions#",
        stEvt:  "http://ns.adobe.com/xap/1.0/sType/ResourceEvent#",
        stFnt:  "http://ns.adobe.com/xap/1.0/sType/Font#",
        stRef:  "http://ns.adobe.com/xap/1.0/sType/ResourceRef#",
        xmp:  "http://ns.adobe.com/xap/1.0/",
        xmpG:  "http://ns.adobe.com/xap/1.0/g/",
        xmpGImg:  "http://ns.adobe.com/xap/1.0/g/img/",
        xmpMM:  "http://ns.adobe.com/xap/1.0/mm/",
        xmpTPg:  "http://ns.adobe.com/xap/1.0/t/pg/",
    };

    /**
     * Exposes the known properties of an XMP document.
     */
    export interface IXmpDocumentProperties {
        /** The document title. */
        title: string;

        /** The creator of this document. */
        creator: string;

        /** The date/time that this document was created. */
        created?: Date;

        /** The date/time that this document was modified. */
        modified?: Date;

        /** The number of pages in this document. */
        numPages?: number;
        hasVisibleOverprint?: boolean;
        hasVisibleTransparency?: boolean;
        creatorTool?: string;
        reditionClass?: string;
    }

    /**
     * Contains a single XMP document, wrapping the inner XML and providing
     * methods to query the inner data.
     */
    export class XmpDocument {
        private _document: Document;
        private _resolver: any;

        /**
         * Initializes a new XMP document object.
         * @param xml XML document to read from.
         */
        constructor(xml: Document) {
            this._document = xml;

            /*
            * It should be possible to use the document itself to build this list,
            * which would be far better for extensibility; however, this doesn't
            * seem to work, so I've falled back to using a manual dictionary; this
            * just has to contain all possible prefixes and namespaces until we 
            * can find a better solution!
            */

            this._resolver = function (prefix: string): string {
                return NAMESPACES[prefix] || "";
            };
        }

        /**
         * Gets the inner XML document.
         */
        public getDocument(): Document {
            return this._document;
        }

        /**
         * Gets the inner XML as a string.
         */
        public getDocumentText(): string {
            return this._document.documentElement.outerHTML;
        }

        /**
         * Gets the title of this document.
         */
        public getTitle(): string {
            return this.getElementValue("//rdf:RDF/rdf:Description/dc:title/rdf:Alt/rdf:li");
        }

        /**
         * Gets the creator of this document.
         */
        public getCreator(): string {
            return this.getElementValue("//rdf:RDF/rdf:Description/dc:creator/rdf:Alt/rdf:li");
        }

        public findElements(expression: string): XPathResult {
            return this._document.evaluate(
                expression,
                this._document,
                this._resolver,
                XPathResult.ANY_TYPE,
                null);
        }

        public getElementValue(expression: string): string {
            let e: Node = this.findElements(expression).iterateNext();
            return e ? e.textContent : "";
        }
    }

    /**
     * Extracts the XMP metadata from a file input.
     * @param file The read to read from.
     * @param callback The callback to run with the extracted XML document.
     */
    export function loadXmpFromFile(file: File, callback: (xml: XmpDocument) => void): void {
        const XMP_START: string = "<x:xmpmeta",
              XMP_END  : string = "</x:xmpmeta>",
              DOC_TYPE : string = "text/xml",
			  reader   : FileReader = new FileReader();

        reader.onload = (e: Event) => {
            // load the XMP by sub-stringing the stringified binary data; seems
            // clunky but is actually quite fast in most browsers; cleverer people
            // might be able to do this using an ArrayBuffer for greater efficiency
            let str: string = (<FileReader>e.target).result,
			    doc: Document = null;

            // work out where the XML data sits within the file
            let startPos: number = str.indexOf(XMP_START),
			    endPos: number = str.indexOf(XMP_END, startPos);

            if (startPos && endPos) {
                let parser: DOMParser = new DOMParser(),
				    xml: string = str.substr(startPos, (endPos + 12) - startPos);
                doc = parser.parseFromString(xml, DOC_TYPE);
            }

            callback(new XmpDocument(doc));
        };
        reader.readAsText(file);
    }

    export function getChildElement(parent: Node, name: string): Element {
        let child: Node;
        for (let i: number = 0; i < parent.childNodes.length; i++) {
            child = parent.childNodes[i];
            if (child.nodeType === Node.ELEMENT_NODE && child.localName === name) {
                return <Element>child;
            }
        }
        return null;
    }

    export function mapElements<TResult>(xmp: XmpDocument,
                                         expression: string,
                                         mapping: (node: Node) => TResult):
                                         Array<TResult> {
        let results: TResult[] = [],
            xpath: XPathResult = xmp.findElements(expression),
            node: Node = xpath.iterateNext();

        while (node) {
            results.push(mapping(node));
            node = xpath.iterateNext();
        }

        return results;
    }
}