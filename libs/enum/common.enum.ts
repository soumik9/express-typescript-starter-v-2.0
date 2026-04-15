export enum AdminRoleEnum {
    SuperAdmin = 'super_admin',
    Admin = 'admin',
}

export enum FnFileReturnTypeEnum {
    Single = 'single',
    Multiple = 'multiple',
}

export enum ServerEnvironmentEnum {
    Development = 'development',
    Production = 'production',
    Test = 'test',
}

export enum CacheTimeEnum {
    OneMinute = 60,
    OneHour = 3600,
    OneDay = 86400,
    OneWeek = 604800,
    OneMonth = 2592000,
}

export enum DurationFilterEnum {
    ThisWeek = 'this_week',
    ThisMonth = 'this_month',
    ThisYear = 'this_year',
    LastMonth = 'last_month',
    SixMonths = '6_months',
    Today = 'today',
}

export enum PassportKeyEnum {
    AdminAuth = 'admin_auth',
}