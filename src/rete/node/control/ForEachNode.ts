import { Node } from "../Node";

// Class defining a For Each Node
export class ForEachNode extends Node {
    currentItemIndex = 0;

    constructor() {
        super("For Each", { height: 235 });
        this.addInExec();
        this.addOutExec("loop", "Loop");
        this.addInData({ name: "array", displayName: "Array", isArray: true });
        this.addOutData({ name: "item", displayName: "Item" });
        this.addOutExec("exec", "Done");
    }
    // Executes the node
    override async execute(input: string, forward: (output: string) => unknown): Promise<void> {
        console.log("Executing For Each Node");
        
        
        
        // const inputs = (await this.fetchInputs());
        
        
        // const array = inputs.array ? inputs.array[0] : [];

        console.log("I'm done");
        
        forward("exec");
    }
    // Gets the data
    data(inputs: {array?: unknown[][]}) : {"item": unknown} {
        const array = inputs.array ? inputs.array[0] : [];
        const item = array[this.currentItemIndex];
        return {item};
    }
}
