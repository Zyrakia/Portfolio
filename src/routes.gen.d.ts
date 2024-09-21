type HandlerType<ResponseSchema = unknown, RequestSchema = unknown> = { __response: ResponseSchema; __request: RequestSchema };

declare type Routes = {
    "/hue": {
    };
    "/": {
    };
    "/projects": {
        "get": HandlerType<Array<
            {
                id: number;
                name: string;
                description: null | string;
                url: null | string;
                start_date: null | string;
                end_date: null | string;
                logo_url: null | string;
                technologies_referenced: number;
            }
        > | Array<
            {
                id: number;
                name: string;
                description: null | string;
                url: null | string;
                start_date: null | string;
                end_date: null | string;
                logo_url: null | string;
            }
        >, number>;
    };
    "/projects/[id]": {
        "get": HandlerType<undefined | {
            description: null | string;
            id: number;
            name: string;
            url: null | string;
            start_date: null | string;
            end_date: null | string;
            logo_url: null | string;
        } | {
            technologies: Array<
                {
                    id: number;
                    name: string;
                    url: null | string;
                    logo_url: null | string;
                    skill_level: null | number;
                    category: null | string;
                }
            >;
            description: null | string;
            id: number;
            name: string;
            url: null | string;
            start_date: null | string;
            end_date: null | string;
            logo_url: null | string;
        }, never>;
    };
    "/status": {
        "get": HandlerType<{
            version: string;
        }, never>;
    };
    "/tech": {
        "get": HandlerType<Array<
            {
                id: number;
                name: string;
                url: null | string;
                logo_url: null | string;
                skill_level: null | number;
                category: null | string;
            }
        > | Array<
            {
                id: number;
                name: string;
                url: null | string;
                logo_url: null | string;
                skill_level: null | number;
                category: null | string;
                projects_referenced: number;
            }
        >, never>;
    };
    "/tech/[id]": {
        "get": HandlerType<undefined | {
            id: number;
            name: string;
            url: null | string;
            logo_url: null | string;
            skill_level: null | number;
            category: null | string;
        } | {
            projects: Array<
                {
                    id: number;
                    name: string;
                    description: null | string;
                    url: null | string;
                    start_date: null | string;
                    end_date: null | string;
                    logo_url: null | string;
                }
            >;
            id: number;
            name: string;
            url: null | string;
            logo_url: null | string;
            skill_level: null | number;
            category: null | string;
        }, never>;
    };
    "/user/[id]": {
        "get": HandlerType<{
            name?: string;
            alias?: string;
            avatar_url?: string;
            bio?: string;
            age?: number;
            location?: string;
            contact: {
                website?: string;
            } & {
                [index: string]: undefined | string;
            };
        }, never>;
    };
};
