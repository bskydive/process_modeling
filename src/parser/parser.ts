import { IParsedData, parser, saveParsedDataFiles } from "./json-parse.github";

const data: IParsedData = parser();

saveParsedDataFiles(data);

