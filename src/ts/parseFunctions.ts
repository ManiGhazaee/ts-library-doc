import * as ts from "typescript";

export function extractFunctionsAndMethods(
    sourceCode: string
): Record<string, string> {
    const sourceFile = ts.createSourceFile(
        "temp.ts",
        sourceCode,
        ts.ScriptTarget.Latest,
        true
    );
    const functionsAndMethods: Record<string, string> = {};

    function visit(node: ts.Node) {
        if (
            ts.isFunctionDeclaration(node) ||
            ts.isMethodDeclaration(node) ||
            ts.isMethodSignature(node)
        ) {
            const functionName = node.name?.getText();
            const functionDefinition = sourceCode.substring(
                node.getStart(),
                node.getEnd()
            );
            if (functionName) {
                functionsAndMethods[functionName] = functionDefinition;
            }
        }

        ts.forEachChild(node, visit);
    }

    visit(sourceFile);

    return functionsAndMethods;
}
