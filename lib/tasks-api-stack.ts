import * as cdk from "aws-cdk-lib";
import { DomainName, EndpointType } from "aws-cdk-lib/aws-apigateway";
import { DnsValidatedCertificate } from "aws-cdk-lib/aws-certificatemanager";
import { CnameRecord, HostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";

export class TasksApiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Constants
    const domainName = "griffindow.com";
    const subDomainName = `api.tasks.${domainName}`;
    const zone = HostedZone.fromLookup(this, "Zone", {
      domainName: domainName,
    });

    // Domain
    const certificate = new DnsValidatedCertificate(
      this,
      "TasksApiCertificate",
      {
        domainName: subDomainName,
        hostedZone: zone,
        region: "us-east-1",
      }
    );
    const customDomain = new DomainName(this, "TasksApiDomain", {
      domainName: subDomainName,
      certificate: certificate,
      endpointType: EndpointType.REGIONAL,
    });

    new CnameRecord(this, "ApiGatewayRecordSet", {
      zone: zone,
      recordName: subDomainName,
      domainName: customDomain.domainNameAliasDomainName,
    });
  }
}
