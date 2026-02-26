import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrgDto } from './dto/org.dto';

@Injectable()
export class OrgService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createOrgDto: CreateOrgDto) {
    const existingOrg = await this.prisma.org.findUnique({
      where: { slug: createOrgDto.slug },
    });

    if (existingOrg) {
      throw new ConflictException('Organization slug is already taken');
    }

    // Use a transaction to ensure both Org and OrgMember are created
    return this.prisma.$transaction(async (prisma) => {
      const org = await prisma.org.create({
        data: {
          name: createOrgDto.name,
          slug: createOrgDto.slug,
        },
      });

      await prisma.orgMember.create({
        data: {
          orgId: org.id,
          userId,
          role: 'OWNER',
        },
      });

      return org;
    });
  }

  async getUserOrgs(userId: string) {
    return this.prisma.org.findMany({
      where: {
        members: {
          some: {
            userId,
          },
        },
      },
      include: {
        members: {
          where: { userId },
          select: { role: true },
        },
      },
    });
  }
}
