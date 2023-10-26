export class UpdatePageDto {
  readonly name: string;
  readonly areas_json:
    | {
        x: string;
        y: string;
        width: string;
        height: string;
        tooltip?: string;
        url: string;
      }[]
    | null;
}
