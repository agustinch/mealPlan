"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlateModule = void 0;
const common_1 = require("@nestjs/common");
const plate_service_1 = require("./plate.service");
const plate_controller_1 = require("./plate.controller");
const prisma_service_1 = require("../prisma.service");
let PlateModule = class PlateModule {
};
PlateModule = __decorate([
    (0, common_1.Module)({
        controllers: [plate_controller_1.PlateController],
        providers: [plate_service_1.PlateService, prisma_service_1.PrismaService],
    })
], PlateModule);
exports.PlateModule = PlateModule;
//# sourceMappingURL=plate.module.js.map