"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlateService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma.service");
let PlateService = class PlateService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    create(createPlateDto) {
        return this.prisma.plate.create({
            data: Object.assign(Object.assign({}, createPlateDto), { ingredientes: {
                    createMany: {
                        data: createPlateDto.ingredientes.map((f) => ({
                            food_id: f.id,
                            amount: f.amount,
                        })),
                    },
                } }),
        });
    }
    findAll() {
        return this.prisma.plate.findMany({
            include: { ingredientes: { include: { food: true } } },
        });
    }
    findOne(id) {
        return `This action returns a #${id} plate`;
    }
    update(id, updatePlateDto) {
        return `This action updates a #${id} plate`;
    }
    remove(id) {
        return `This action removes a #${id} plate`;
    }
};
PlateService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], PlateService);
exports.PlateService = PlateService;
//# sourceMappingURL=plate.service.js.map