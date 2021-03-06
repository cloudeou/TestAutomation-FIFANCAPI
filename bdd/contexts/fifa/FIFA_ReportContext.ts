import { Identificators } from "../Identificators";
import { envConfig } from "../../../bdd-src/fifa/env-config";
// import { FileWriter } from '../../../bdd-src/utils/common/FileWriter';

const dsRepDir =
  process.cwd().replace(new RegExp('\\\\', 'g'), '/') +
  '/' +
    envConfig.dataSetDetailedReportsDir
  // brconfig.getLocationDataSetReportsDirForGivenEnv();

export default class FIFA_ReportContext {
    private caseResult: any;
    private testId: string = '';
    public identificator = Identificators.FIFA_reportContext;
    public setTestResult(value: string) {
        this.caseResult.datasets[0].result = value;
      }
    // public writeTestResultFile() {
    //     FileWriter.sync(
    //       `${dsRepDir}/${this.testId}.json`,
    //       JSON.stringify(this.caseResult),
    //       false,
    //     );
    //   }
}