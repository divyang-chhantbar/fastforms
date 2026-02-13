import Papa from 'papaparse';
import { Exporter } from './types';
import { normalizeResponses } from './utils';

export const exportToCSV : Exporter = (input)=> {
    const normalizedData = normalizeResponses(input.responses);

    const csvContent = Papa.unparse(normalizedData);

    const formattedTitle = input.formTitle
        .toLowerCase()
        .replace(/\s+/g, '_')
        .replace(/[^a-z0-9_]/g, '');

    const fileName = `${formattedTitle || 'export' }-responses.csv`;
    return {
        content : csvContent,
        mimeType : 'text/csv; charset=utf-8',
        fileName,
    }
}