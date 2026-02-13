export interface ExportInput {
    formTitle : string;
    responses : Array<{
        data : Record<string, any>;
        createdAt : string;
    }>;
}

export interface ExportOutput {
    content : string;
    mimeType : string;
    fileName : string;
}

export type Exporter = (input : ExportInput) => ExportOutput;