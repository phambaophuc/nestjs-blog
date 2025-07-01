import { PaginatedResponseDto } from '@/common';

import { ArticleDetailDto, ArticleListDto } from './article.dto';

export class ArticleDetailResponse extends ArticleDetailDto {}
export class ArticleListResponse extends PaginatedResponseDto<ArticleListDto> {}
