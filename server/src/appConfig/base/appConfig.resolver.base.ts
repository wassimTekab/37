/*
//------------------------------------------------------------------------------ 
// This code was generated by Amplication. 
// 
// Changes to this file will be lost if the code is regenerated. 
//
// There are other ways to to customize your code, see this doc to learn more
// https://docs.amplication.com/docs/how-to/custom-code
//
//------------------------------------------------------------------------------
  */
import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as apollo from "apollo-server-express";
import * as nestAccessControl from "nest-access-control";
import { GqlDefaultAuthGuard } from "../../auth/gqlDefaultAuth.guard";
import * as gqlACGuard from "../../auth/gqlAC.guard";
import * as gqlUserRoles from "../../auth/gqlUserRoles.decorator";
import * as abacUtil from "../../auth/abac.util";
import { isRecordNotFoundError } from "../../prisma.util";
import { MetaQueryPayload } from "../../util/MetaQueryPayload";
import { PaginatedInterface } from "../../util/PaginatedInterface";
import { CreateAppConfigArgs } from "./CreateAppConfigArgs";
import { UpdateAppConfigArgs } from "./UpdateAppConfigArgs";
import { DeleteAppConfigArgs } from "./DeleteAppConfigArgs";
import { AppConfigFindManyArgs } from "./AppConfigFindManyArgs";
import { AppConfigFindUniqueArgs } from "./AppConfigFindUniqueArgs";
import { AppConfig } from "./AppConfig";
import { AppConfigService } from "../appConfig.service";

@graphql.Resolver(() => AppConfig)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class AppConfigResolverBase {
  constructor(
    protected readonly service: AppConfigService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @graphql.Query(() => MetaQueryPayload)
  @nestAccessControl.UseRoles({
    resource: "AppConfig",
    action: "read",
    possession: "any",
  })
  async _appsConfigMeta(
    @graphql.Args() args: AppConfigFindManyArgs
  ): Promise<MetaQueryPayload> {
    const results = await this.service.count({
      ...args,
      skip: undefined,
      take: undefined,
    });
    return {
      count: results,
    };
  }

  @graphql.Query(() => [AppConfig])
  @nestAccessControl.UseRoles({
    resource: "AppConfig",
    action: "read",
    possession: "any",
  })
  async appsConfig(
    @graphql.Args() args: AppConfigFindManyArgs,
    @gqlUserRoles.UserRoles() userRoles: string[]
  ): Promise<PaginatedInterface<AppConfig>> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "read",
      possession: "any",
      resource: "AppConfig",
    });
    const results = await this.service.findMany(args);
    const result = results.paginatedResult.map((result: AppConfig) =>
      permission.filter(result)
    );
    return { paginatedResult: result, totalCount: results.totalCount };
  }

  @graphql.Query(() => AppConfig, { nullable: true })
  @nestAccessControl.UseRoles({
    resource: "AppConfig",
    action: "read",
    possession: "own",
  })
  async appConfig(
    @graphql.Args() args: AppConfigFindUniqueArgs,
    @gqlUserRoles.UserRoles() userRoles: string[]
  ): Promise<AppConfig | null> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "read",
      possession: "own",
      resource: "AppConfig",
    });
    const result = await this.service.findOne(args);
    if (result === null) {
      return null;
    }
    return permission.filter(result);
  }

  @graphql.Mutation(() => AppConfig)
  @nestAccessControl.UseRoles({
    resource: "AppConfig",
    action: "create",
    possession: "any",
  })
  async createAppConfig(
    @graphql.Args() args: CreateAppConfigArgs,
    @gqlUserRoles.UserRoles() userRoles: string[]
  ): Promise<AppConfig> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "create",
      possession: "any",
      resource: "AppConfig",
    });
    const invalidAttributes = abacUtil.getInvalidAttributes(
      permission,
      args.data
    );
    if (invalidAttributes.length) {
      const properties = invalidAttributes
        .map((attribute: string) => JSON.stringify(attribute))
        .join(", ");
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new apollo.ApolloError(
        `providing the properties: ${properties} on ${"AppConfig"} creation is forbidden for roles: ${roles}`
      );
    }
    // @ts-ignore
    return await this.service.create({
      ...args,
      data: args.data,
    });
  }

  @graphql.Mutation(() => AppConfig)
  @nestAccessControl.UseRoles({
    resource: "AppConfig",
    action: "update",
    possession: "any",
  })
  async updateAppConfig(
    @graphql.Args() args: UpdateAppConfigArgs,
    @gqlUserRoles.UserRoles() userRoles: string[]
  ): Promise<AppConfig | null> {
    const permission = this.rolesBuilder.permission({
      role: userRoles,
      action: "update",
      possession: "any",
      resource: "AppConfig",
    });
    const invalidAttributes = abacUtil.getInvalidAttributes(
      permission,
      args.data
    );
    if (invalidAttributes.length) {
      const properties = invalidAttributes
        .map((attribute: string) => JSON.stringify(attribute))
        .join(", ");
      const roles = userRoles
        .map((role: string) => JSON.stringify(role))
        .join(",");
      throw new apollo.ApolloError(
        `providing the properties: ${properties} on ${"AppConfig"} update is forbidden for roles: ${roles}`
      );
    }
    try {
      // @ts-ignore
      return await this.service.update({
        ...args,
        data: args.data,
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new apollo.ApolloError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }

  @graphql.Mutation(() => AppConfig)
  @nestAccessControl.UseRoles({
    resource: "AppConfig",
    action: "delete",
    possession: "any",
  })
  async deleteAppConfig(
    @graphql.Args() args: DeleteAppConfigArgs
  ): Promise<AppConfig | null> {
    try {
      // @ts-ignore
      return await this.service.delete(args);
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new apollo.ApolloError(
          `No resource was found for ${JSON.stringify(args.where)}`
        );
      }
      throw error;
    }
  }
}