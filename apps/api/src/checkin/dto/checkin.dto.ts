import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class ScanTicketDto {
  @IsUUID('4', { message: 'Invalid QR Code format' })
  @IsNotEmpty()
  qrCode!: string;

  @IsString()
  @IsNotEmpty()
  eventId!: string;
}
