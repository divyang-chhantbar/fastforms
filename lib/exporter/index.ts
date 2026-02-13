// this file is used to export all the modules in the exporter directory
// like if we have a new integration in the future we dont have to refactor the whole api instead ,
// we can just add the new integration in this file and export it

import { Exporter } from "./types";
import { exportToCSV } from "./csv";

export const exporters : Record<string, Exporter> = {
    csv : exportToCSV
}

export const SUPPORTED_EXPORTERS = Object.keys(exporters);
export * from "./types";