import { PartialType } from '@nestjs/swagger';
import { CreateJournalEntryDto } from './create-entry.dto';

export class UpdateJournalEntryDto extends PartialType(CreateJournalEntryDto) {}
