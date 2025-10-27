import { Meta } from "@/app/domain/metaDomain";

export class Suggestion {
    constructor(
        public id: string,
        public task: string,
        public data: JSON,
        public createdAt: Date,
        public updatedAt: Date,
    ) { }
}

export class SuggestionListItem {
    constructor(
        public id: string
    ) { }
}

export class SuggestionPaginatedResponse {
    constructor(
        public suggestions: SuggestionListItem[],
        public meta: Meta,
    ) { }
}

