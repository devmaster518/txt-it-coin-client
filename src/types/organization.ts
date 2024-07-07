export type OrganizationStatus = 'all' | 'active' | 'archived';

export type IOrganizationTableFilter = {
  search: string;
  status: OrganizationStatus;
};

export type IOrganizationPrismaFilter = {
  OR?: any;
  deletedAt?: any;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  email?: string | null;
  phone?: string | null;
  avatarUrl?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
};
