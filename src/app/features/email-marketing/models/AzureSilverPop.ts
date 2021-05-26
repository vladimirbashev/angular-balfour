export class FileUploadResult {
  IsSuccess: boolean;
  Message: string; 
  SilverPopJobID: number;
  SilverPopAPIResponse: string;
}

export class SilverPopUpload {
  SilverPopUploadId: number;

  EntityId: string;

  UserId: string;

  FileName: string;

  RecordCount: number;

  SilverPopJobId: number;

  SentToSilverPopDate: Date;

  SilverPopImportCompletedDate: Date;
}

export class GetConfigResult {
  requiredColumns: string[];
  optionalColumns: string[];
}
