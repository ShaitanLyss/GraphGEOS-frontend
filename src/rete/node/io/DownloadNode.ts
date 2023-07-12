import { ButtonControl } from "$rete/control/button/button";
import { Node } from "../Node";
import type { NodeFactory } from "../NodeFactory";
import type { XMLData } from "../xml/XMLData";
import xmlFormat from "xml-formatter";

export class DownloadNode extends Node {
    constructor({factory}: {factory: NodeFactory}) {
        super({label:'Download', factory, height: 160});
        this.addInData({name: 'data', displayName: 'Data', socketLabel: 'Data', type: 'any'});
        this.addControl('downloadBtn', new ButtonControl("Download", async () => {
            const inputs = await this.fetchInputs();
            const data = this.getData('data', inputs) as XMLData;
            console.log(xmlFormat(data.toXml()));
        }))
    }
}