var CPU = {
    DOM_CPU: null,
    RAM : [],
    REGISTERS: {
        EAX: 0,
        PC: 0,
        MAR: 0,
        MBR: 0,
        IR: 0,
        R1: 0,
        R2: 0,
        R3: 0,
        R4: 0,
        R5: 0,
        R6: 0,
        OF: 0,
        CF: 0,
        ZF: 0,
    },
	STATE: 0,
	RUNNING: false,
	NEXT_TIMEOUT: 0,
	RUN_DELAY: 1000,
	registros: {
		0: "R1",
		1: "R2",
		2: "R3",
		3: "R4",
		4: "R5",
		5: "R6",
	},

	step: function(){
		function setState(nextState, stageName, description) {
				
			description = description.replace(/\*(.*?)\*/g, function(match, contents) {
				return '<span class="hint_name">' + contents + '</span>';
			});
			CPU.showHint('<span class="fetch_decode_execute ' + stageName.toLowerCase() + '">' + stageName + '</span>' + description);
			CPU.STATE = nextState;
		}
		switch(CPU.STATE){
			case 0: 
				setState(1, "Ciclo de captación:", " La *Unidad de Control* copia el valor del *Contador de programa* en el *registro de direccion de memoria* y luego este se coloca en el *bus de direcciones*");
				CPU.REGISTERS.MAR = CPU.REGISTERS.PC;
				CPU.updateRegisters();
				$('.active').removeClass('active');
				$('#reg_pc,#reg_mar').addClass('active');
				$('.current_instruction').removeClass('current_instruction');
				$('#ram_address_' + CPU.REGISTERS.PC).addClass('current_instruction');
				break;
			case 1:
				setState(2, "Ciclo de captación:", "La *Unidad de Control* coloca la dirección del MAR en el *Bus de Direcciones* y luego este se carga el valor almacenado en el *Bus de Datos*.");
				$('.active').removeClass('active');
				$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
				break;
			case 2:
				setState(3, "Ciclo de captación:", "La *Unidad de Control* almacena el valor del *Bus de Datos* en el *MBR*.");
				CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
				CPU.updateRegisters();
				$('.active').removeClass('active');
				$('#reg_mbr').addClass('active');
				break;	
			case 3:
				setState(4,"Ciclo de captación:", "La *Unidad de Control* incrementa el *PC* en 1");
				CPU.REGISTERS.PC++;
				CPU.updateRegisters();
				$('.active').removeClass('active');
				$('#reg_pc').addClass('active');
				break;
			case 4: 
				setState(5, "Ciclo de captación:", "La *Unidad de Control* copia el valor del *MBR* en el *IR*.");
				CPU.REGISTERS.IR = CPU.REGISTERS.MBR;
				CPU.updateRegisters();
				$('.active').removeClass('active');
				$('#reg_mbr,#reg_ir').addClass('active');
				break;		
			case 5:
				setState(6, "Decodificación de instrucción", "El *decodificador* obtiene el *codop* y el *operando* del *IR*"); 
				$('.active').removeClass('active');
				$('#reg_ir,.decode_unit table').addClass('active');
				break;				
			case 6:
				var codop = ((CPU.REGISTERS.IR & 0xffff) >> 11);
				console.log("IR:" + CPU.REGISTERS.IR);
				$('.active').removeClass('active');
				$('.decode_row_' + codop).addClass('active');
				switch(codop) {
					case 0:
						setState(7, "Decodificación de instrucción", "*codop 00000* ->  ADD"); //LISTO
						break;
						
					case 1:
						setState(8, "Decodificación de instrucción", "*codop 00001* ->  SUB"); //LISTO
						break;
						
					case 2:
						setState(9, "Decodificación de instrucción", "*codop 00010* ->  MUL"); //LISTO
						break;
						
					case 3:
						setState(10, "Decodificación de instrucción", "*codop 00011* ->  DIV"); //LISTO
						break;
						
					case 4:
						setState(11, "Decodificación de instrucción", "*codop 00100* ->  MOVE");
						break;
						
					case 5:
						setState(12, "Decodificación de instrucción", "*codop 00101* ->  DEC"); //LISTO
						break;
						
					case 6:
						setState(13, "Decodificación de instrucción", "*codop 00110* ->  INC"); //LISTO
						break;
						
					case 7:
						setState(14, "Decodificación de instrucción", "*codop 00111* ->  CMP");
						break;
						
					case 8:
						setState(15, "Decodificación de instrucción", "*codop 01000* ->  JZ");
						break;

					case 9:
						setState(16, "Decodificación de instrucción", "*codop 01001* ->  JNZ");
						break;
						
					case 10:
						setState(17, "Decodificación de instrucción", "*codop 01010* ->  NOT");
						break;
						
					case 11:
						setState(18, "Decodificación de instrucción", "*codop 01011* ->  AND");
						break;

					case 12:
						setState(19, "Decodificación de instrucción", "*codop 01100* ->  OR");
						break;

					case 13:
						setState(20, "Decodificación de instrucción", "*codop 01101* ->  JA");
						break;
						
					case 14:
						setState(21, "Decodificación de instrucción", "*codop 01110* ->  JAE");
						break;
						
					case 15:
						setState(22, "Decodificación de instrucción", "*codop 01111* ->  JB");
						break;

					case 16:
						setState(23, "Decodificación de instrucción", "*codop 10000* ->  JBE");
						break;

					case 17:
						setState(24, "Decodificación de instrucción", "*codop 10001* ->  IN"); //LISTO
						break;	

					case 18:
						setState(25, "Decodificación de instrucción", "*codop 10010* ->  OUT"); //LISTO
						break;
					
					case 19:
						setState(26, "Decodificación de instrucción", "*codop 10011* ->  LOAD"); 
						break;

					case 20:
						setState(27, "Decodificación de instrucción", "*codop 10100* ->  STORE"); 
						break;
					
					case 21:
						setState(28, "Decodificación de instrucción", "*codop 10101* ->  CLEAR"); 
						break;

					case 22:
						setState(29, "Se ha detenido la instrucción", "*copdop 10110* -> END"); //LISTO
				}
				break;

				//ADD
				case 7:
					setState(71, "Decodificación de instrucción", "El *IR* envía el *dirección de memoria* a la *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar, #reg_ir').addClass('active');
					break;
				case 71: 
					setState(72, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 72:
					setState(73, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 73:
					setState(74, "Ciclo de ejecución", "La *MBR* guardará el valor del primer operando en el primer registro del Banco de registros");
					CPU.REGISTERS.R1 = CPU.REGISTERS.MBR;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr, #reg_r1').addClass('active');
					break;
				case 74:
					setState(75, "Decodificación de instrucción", "El *IR* envía el *dirección de memoria* a la *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = (CPU.REGISTERS.IR >> 4) & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar,.decode_row_1').addClass('active');
					break;
				case 75: 
					setState(76, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 76:
					setState(77, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 77:
					setState(78, "Ciclo de ejecución", "La *MBR* guardará el valor del primer operando en el segunda registro del Banco de registros");
					CPU.REGISTERS.R2 = CPU.REGISTERS.MBR;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr, #reg_r1').addClass('active');
					break;
				case 78:
					setState(27, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que sume el valor de *R1* y de *R2*. El resultado lo coloca de nuevo en el *acumulador");
					
					CPU.REGISTERS.EAX = CPU.REGISTERS.R1 + CPU.REGISTERS.R2;
					
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr,#reg_r1,#reg_r2').addClass('active');
					break;


				//SUB
				case 8:
					setState(81, "Decodificación de instrucción", "El *decodificador* envía el *codop* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar, #reg_ir').addClass('active');
					break;
				case 81: 
					setState(82, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 82:
					setState(83, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 83:
					setState(84, "Ciclo de ejecución", "La *MBR* guardará el valor del primer operando en el primer registro del Banco de registros");
					CPU.REGISTERS.R1 = CPU.REGISTERS.MBR;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr, #reg_r1').addClass('active');
					break;
				case 84:
					setState(85, "Decodificación de instrucción", "El *IR* envía el *dirección de memoria* a la *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = (CPU.REGISTERS.IR >> 4) & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar,.decode_row_1').addClass('active');
					break;
				case 85: 
					setState(86, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 86:
					setState(87, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 87:
					setState(88, "Ciclo de ejecución", "La *MBR* guardará el valor del primer operando en el segundo registro del Banco de registros");
					CPU.REGISTERS.R2 = CPU.REGISTERS.MBR;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr, #reg_r1').addClass('active');
					break;
				case 88:
					setState(27, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que sume el valor de *R1* y de *R2*. El resultado lo coloca de nuevo en el *acumulador");
					
					CPU.REGISTERS.EAX = CPU.REGISTERS.R1 - CPU.REGISTERS.R2;

					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr,#reg_r1,#reg_r2').addClass('active');
					break;

							
				//MPY
				case 9:
					setState(91, "Decodificación de instrucción", "El *decodificador* envía el *codop* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar, #reg_ir').addClass('active');
					break;
				case 91: 
					setState(92, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 92:
					setState(93, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 93:
					setState(94, "Ciclo de ejecución", "La *MBR* guardará el valor del primer operando en el primer registro del Banco de registros");
					CPU.REGISTERS.R1 = CPU.REGISTERS.MBR;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr, #reg_r1').addClass('active');
					break;
				case 94:
					setState(95, "Decodificación de instrucción", "El *IR* envía el *dirección de memoria* a la *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = (CPU.REGISTERS.IR >> 4) & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar,.decode_row_1').addClass('active');
					break;
				case 95: 
					setState(96, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 96:
					setState(97, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 97:
					setState(98, "Ciclo de ejecución", "La *MBR* guardará el valor del primer operando en el segundo registro del Banco de registros");
					CPU.REGISTERS.R2 = CPU.REGISTERS.MBR;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr, #reg_r1').addClass('active');
					break;
				case 98:
					setState(27, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que sume el valor de *R1* y de *R2*. El resultado lo coloca de nuevo en el *acumulador");
					
					CPU.REGISTERS.EAX = CPU.REGISTERS.R1 * CPU.REGISTERS.R2;

					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr,#reg_r1,#reg_r2').addClass('active');
					break;

				
				//DIV
				case 10:
					setState(101, "Decodificación de instrucción", "El *decodificador* envía el *codop* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar, #reg_ir').addClass('active');
					break;
				case 101: 
					setState(102, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 102:
					setState(103, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 103:
					setState(104, "Ciclo de ejecución", "La *MBR* guardará el valor del primer operando en el primer registro del Banco de registros");
					CPU.REGISTERS.R1 = CPU.REGISTERS.MBR;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr, #reg_r1').addClass('active');
					break;
				case 104:
					setState(105, "Decodificación de instrucción", "El *IR* envía el *dirección de memoria* a la *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = (CPU.REGISTERS.IR >> 4) & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar, #reg_ir').addClass('active');
					break;
				case 105: 
					setState(106, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 106:
					setState(107, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 107:
					setState(108, "Ciclo de ejecución", "La *MBR* guardará el valor del primer operando en el segundo registro del Banco de registros");
					CPU.REGISTERS.R2 = CPU.REGISTERS.MBR;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr, #reg_r1').addClass('active');
					break;
				case 108:
					setState(27, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que sume el valor de *R1* y de *R2*. El resultado lo coloca de nuevo en el *acumulador");
					
					CPU.REGISTERS.EAX = Math.floor(CPU.REGISTERS.R1 / CPU.REGISTERS.R2);

					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr,#reg_r1,#reg_r2').addClass('active');
					break;

				
				//MOVE
				case 11:
					setState(111, "Decodificación de instrucción", "El *decodificador* envía el *codop* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar, #reg_ir').addClass('active');
					break;
				case 111: 
					setState(112, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 112:
					setState(113, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 113:
					setState(0, "", "");
					Registro = (CPU.REGISTERS.IR >> 4) & 0x0F; //4 bits de direccion del registro 0-6 000 - 110
					//Registro R1, R2, R3, R4, R5, R6
					nombreRegistro = CPU.registros[Registro];
					console.log(nombreRegistro);
					CPU.REGISTERS[nombreRegistro] = CPU.REGISTERS.MBR;
					console.log(CPU.REGISTERS[nombreRegistro]);
					CPU.updateRegisters();
					break;

				//Valide los ultimos 3 bits y lo envie a ese registro del banco de registros
				

				//DEC
				case 12:
					setState(121, "Ciclo de ejecución", "El *decodificador* envía el *la dirección de memoria* y a su vez este lo envía al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar, #reg_ir').addClass('active');
					break;
				case 121: 
					setState(122, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 122:
					setState(123, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 123:
					setState(27, "Ciclo de ejecución", "La *unidad de control* le indica a la ALU que reste el valor presente en la *MBR* en 1");
					CPU.REGISTERS.EAX = CPU.REGISTERS.MBR - 1;
					CPU.updateRegisters();
					$('.active').removeClass('active');
                    $('#reg_mbr,#alu,#acc').addClass('active');
                    break;
				
				//INC
				case 13:
					setState(131, "Ciclo de ejecución", "El *decodificador* envía el *la dirección de memoria* y a su vez este lo envía al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar, #reg_ir').addClass('active');
					break;
				case 131: 
					setState(132, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 132:
					setState(133, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 133:
					setState(27, "Ciclo de ejecución", "La *unidad de control* le indica a la ALU que sume el valor presente en la *MBR* en 1");
					CPU.REGISTERS.EAX = CPU.REGISTERS.MBR + 1;
					CPU.updateRegisters();
					$('.active').removeClass('active');
                    $('#reg_mbr,#alu,#acc').addClass('active');
                    break;


				//CMP
				case 14:
					setState(141, "Decodificación de instrucción", "El *decodificador* envía el *codop* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar,.decode_row_1').addClass('active');
					break;
				case 141: 
					setState(142, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 142:
					setState(143, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 143:
					setState(0, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que haga la comparación y dependiendo del resultado se establecen los registros de banderas CF, ZF y OF en 0 o 1");
					if(CPU.REGISTERS.MBR == CPU.REGISTERS.EAX){
						if (CPU.REGISTERS.MBR > CPU.REGISTERS.EAX){
							CPU.REGISTERS.CF = 1;
						}
						else if (CPU.REGISTERS.MBR < CPU.REGISTERS.EAX){
							CPU.REGISTERS.OF = 1;
						}
						CPU.REGISTERS.ZF = 1;
					} 
					else if(CPU.REGISTERS.MBR > CPU.REGISTERS.EAX){
						CPU.REGISTERS.CF = 1
					}
					else if(CPU.REGISTERS.MBR < CPU.REGISTERS.EAX){
						CPU.REGISTERS.OF = 1
					} 
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr,#reg_eax,#reg_cf,#reg_zf,#alu,#acc,#reg_of').addClass('active');
					break;
				
				//JZ
				case 15:
					setState(0, "Ciclo de ejecución", "La *unidad de control* verifica que el registro *ZF* este en 0 (si está en 1 se realiza un salto)");
					if(CPU.REGISTERS.ZF == 1){
						CPU.REGISTERS.PC = CPU.REGISTERS.IR & 0x0F
					}
					CPU.REGISTERS.ZF = 0; 
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar,#reg_pc,#reg_zf').addClass('active');
					break;
				
				//JNZ
				case 16:
					setState(0, "Ciclo de ejecución", "La *unidad de control* verifica que el registro *ZF* este en 0 (si está en 1 se realiza un salto)");
					if(CPU.REGISTERS.ZF != 1){
						CPU.REGISTERS.PC = CPU.REGISTERS.IR & 0x0F
					}
					//CPU.REGISTERS.ZF = 0; 
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar,#reg_pc,#reg_zf').addClass('active');
					break;
				
				//JA
				case 20:
					setState(0, "Ciclo de ejecución", "La *unidad de control* verifica que el registro *CF* este en 0 (si está en 1 se realiza un salto)");
					if(CPU.REGISTERS.CF == 1 ){
						CPU.REGISTERS.PC = CPU.REGISTERS.IR & 0x0F
					}
					CPU.REGISTERS.CF = 0; 
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar,#reg_pc,#reg_cf').addClass('active');
					break;
				
				//JAE
				case 21:
					setState(0, "Ciclo de ejecución", "La *unidad de control* verifica que el registro *CF* y *ZF* este en 0 (si está en 1 se realiza un salto)");
					if(CPU.REGISTERS.CF == 1 || CPU.REGISTERS.ZF == 1 ){
						CPU.REGISTERS.PC = CPU.REGISTERS.IR & 0x0F
					}
					CPU.REGISTERS.CF = 0; 
					CPU.REGISTERS.ZF = 0; 
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar,#reg_pc,#reg_cf,#reg_zf').addClass('active');
					break;

				//JB
				case 22:
					setState(0, "Ciclo de ejecución", "La *unidad de control* verifica que el registro *OF* este en 0 (si está en 1 se realiza un salto)");
					if(CPU.REGISTERS.OF == 1 ){
						CPU.REGISTERS.PC = CPU.REGISTERS.IR & 0x0F
					}
					CPU.REGISTERS.OF = 0; 
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar,#reg_pc,#reg_cf').addClass('active');
					break;
				
				//JBE
				case 23:
					setState(0, "Ciclo de ejecución", "La *unidad de control* verifica que el registro *OF* y *ZF* este en 0 (si está en 1 se realiza un salto)");
					if(CPU.REGISTERS.OF == 1 || CPU.REGISTERS.ZF == 1 ){
						CPU.REGISTERS.PC = CPU.REGISTERS.IR & 0x0F
					}
					CPU.REGISTERS.OF = 0;
					CPU.REGISTERS.ZF = 0; 
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar,#reg_pc,#reg_cf,#reg_zf').addClass('active');
					break;
				
				//NOT
				case 17:
					setState(171, "Decodificación de instrucción", "El *decodificador* envía el *codop* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar, #reg_ir').addClass('active');
					break;	
				case 171:
					setState(172, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 172:
					setState(173, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 173:
					setState(27, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que haga el NOT bit a bit y luego pone el resultado en el *acumulador*");
					CPU.REGISTERS.EAX = ~CPU.REGISTERS.MBR
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr,#reg_eax,#alu,#acc').addClass('active');
					break;

				//AND 
				case 18:
					setState(181, "Decodificación de instrucción", "El *IR* envía el *dirección de memoria* a la *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar, #reg_ir').addClass('active');
					break;
					case 181: 
					setState(182, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;

					case 182:
					setState(183, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;

					case 183:
					setState(184, "Ciclo de ejecución", "La *MBR* guardará el valor del primer operando en el primer registro del Banco de registros");
					CPU.REGISTERS.R1 = CPU.REGISTERS.MBR;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr, #reg_r1').addClass('active');
					break;

					case 184:
					setState(185, "Decodificación de instrucción", "El *IR* envía el *dirección de memoria* a la *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = (CPU.REGISTERS.IR >> 4) & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar, #reg_ir').addClass('active');
					break;

					case 185: 
					setState(186, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
					
					case 186:
					setState(187, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
					
					case 187:
					setState(27, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que haga el AND bit a bit y luego pone el resultado en el *acumulador*");
					console.log("eax-before",CPU.REGISTERS.EAX)
					CPU.REGISTERS.EAX = CPU.REGISTERS.MBR & CPU.REGISTERS.R1
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr,#reg_eax,#alu,#acc').addClass('active');
					break;


				//OR
				case 19:
					setState(191, "Decodificación de instrucción", "El *IR* envía la *dirección de memoria* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
					CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar, #reg_ir').addClass('active');
					break;
				case 191: 
					setState(192, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 192:
					setState(193, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
				case 193:
					setState(194, "Ciclo de ejecución", "La *MBR* guardará el valor del primer operando en el primer registro del Banco de registros");
					CPU.REGISTERS.R1 = CPU.REGISTERS.MBR;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr, #reg_r1').addClass('active');
					break;
				case 194:
					setState(195, "Decodificación de instrucción", "El *IR* envía el *dirección de memoria* a la *MAR* y a su vez este lo envia al *Bus de Direcciones*.");						
					CPU.REGISTERS.MAR = (CPU.REGISTERS.IR >> 4) & 0x0F;						
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar, #reg_ir').addClass('active');
					break;
				case 195: 
					setState(196, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				case 196:
					setState(197, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
					CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr').addClass('active');
					break;
				case 197:
					setState(198, "Ciclo de ejecución", "La *MBR* guardará el valor del primer operando en el segundo registro del Banco de registros");
					CPU.REGISTERS.R2 = CPU.REGISTERS.MBR;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr, #reg_r1').addClass('active');
					break;
				case 198:
					setState(27, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que haga el OR bit a bit y luego pone el resultado en el *acumulador*");
					console.log("eax-before",CPU.REGISTERS.EAX)
					CPU.REGISTERS.EAX = CPU.REGISTERS.R1 | CPU.REGISTERS.R1
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mbr,#reg_eax,#alu,#acc').addClass('active');
					break;

                //INPUT
				case 24:
					setState(27, "Ciclo de ejecución", "El *bus de control* lee el *dispositivos de entrada* y coloca el dato en el *acumulador*");
					CPU.REGISTERS.EAX = parseInt(prompt("Ingresar valor decimal:")) & 0xFFFF;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_eax').addClass('active');
					break;
				//OUTPUT
				case 25:
					setState(27, "Ciclo de ejecución", "El *bus de control* envia el valor del *acumulador* al *dispositivo de salida*");
					alert("Resultado: " + CPU.REGISTERS.EAX);
					$('.active').removeClass('active');
					$('#reg_eax').addClass('active');
					break;
				
				case 27:
					setState(271, "Decodificación de instrucción", "La *unidad de control* envia el valor del *acumulador* al *MBR*");
					CPU.REGISTERS.MBR = CPU.REGISTERS.EAX;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_eax,#reg_mbr').addClass('active');
					break;
				case 271:
					setState(272, "Decodificación de instrucción", "El *decodificador* envia el *operando* al *MAR* y este lo envia al *Bus de direcciones*");
					CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
					console.log("MAR: " + CPU.REGISTERS.MAR);
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#reg_mar').addClass('active');
					break;
				case 272: 
					setState(0, "Ciclo de ejecución", "La *unidad de control* le dice a la memoria que guarde el valor que se encuentra en el *bus de datos* en la dirección que se encuentra en el *bus de direcciones*");
					CPU.RAM[CPU.REGISTERS.MAR] = CPU.REGISTERS.MBR;
					CPU.updateRegisters();
					$('.active').removeClass('active');
					$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
					break;
				
				case 29:
					setState(7, "Ciclo de ejecución", "Se ha *detenido* la ejecución del programa");
					$('.active').removeClass('active');
					CPU.RUNNING = false;
					break;
			}

		if(CPU.RUNNING) {
			CPU.NEXT_TIMEOUT = setTimeout(CPU.step, CPU.RUN_DELAY);
		}
	},

	//mensaje abajo de la pantalla
	showHint: function(html) {
		$('#hint_text').html(html);
	},
    
    padNumber: function(val, length) {
		while(val.length < length) {
			val = "0" + val;
		}
		return val;
	},

    /**
     * 
     * @param dec Número en formato hexadecimal
     * @returns 
     */
    hex2bin: function(hex) {
		var v = parseInt(hex, 16) & 0xFFFF;
		return CPU.padNumber(v.toString(2), 16);
	},
	
	bin2hex: function(bin) {
		var v = parseInt(bin, 2) & 0xFFFF;
		return CPU.padNumber(v.toString(16), 2);
	},
	
	bin2dec: function(bin) {
		var v = parseInt(bin, 2) & 0xFFFF;
		if (v >= 32768) 
        	v -= 65536;
		return v;
	},
	
    /**
     * 
     * @param dec Número en formato decimal
     * @returns 
     */
	dec2bin: function(dec) {
		return CPU.padNumber((dec & 0xFFFF).toString(2), 16);
	},
	
	hex2dec: function(hex) {
		var v = parseInt(hex, 16) & 0xFFFF;
		console.log("Valor a convertir: " + v)
		if (v >= 32768) 
        	v -= 65536;
		return v;
	},
	
	dec2hex: function(dec) {
		return CPU.padNumber((dec & 0xFFFF).toString(16), 2);
	},
	

    /**
     * Actualiza el valor de los registros
     */
    updateRegisters: function() {
        var regs = Object.keys(CPU.REGISTERS);
        function writeValue(val, jqDest) {
			if(jqDest.hasClass("value_binary")) {
				val = CPU.dec2bin(val);
			}
			if(jqDest.hasClass("value_hex")) {
				val = CPU.dec2hex(val);
			}
			jqDest.text(val);
		}

        for(var i = 0; i < regs.length; i++) {
			var val = CPU.REGISTERS[regs[i]];
			var jqDest = $('#reg_' + regs[i].toLowerCase() + "_val");
			writeValue(val, jqDest);
		}

        for(var i = 0; i < CPU.RAM.length; i++) {
			writeValue(CPU.RAM[i], $('#ram_value_' + i));
		}
    },

    

    /**
     * Dibuja los botones para visualziar los registros
     */
    drawRamButtons: function(html) {
        html += '<div class="btn-group" role="group" aria-label="Number base">'
        html += '<button type="button" class="btn btn_values btn-secondary" id="btn_values_binary"> Binario</button>'
        html += '<button type="button" class="btn btn_values btn-secondary" id="btn_values_denary">  Decimal </button>'
        html += '<button type="button" class="btn btn_values btn-secondary" id="btn_values_hex"> Hex </button></div>'
        return html
    },

    /**
     * Dibuja el decodificador con todos los CODOP
     */
    drawDecoder: function (html){
        html += '<div class="decode_unit"><h4> Decodificador </h2>';
		html += '<table class="table table-fixed table-striped table-hover"><thead><tr><th>Codop</th><th>Operando</th><th>Instrucción</th></tr></thead>';
		html += '<tr class="decode_row_0"><td>00000</td><td>00000</td><td>ADD</td></tr>';
		html += '<tr class="decode_row_1"><td>00001</td><td>dirección</td><td>SUB</td></tr>';
		html += '<tr class="decode_row_2"><td>00010</td><td>dirección</td><td>MUL</td></tr>';
		html += '<tr class="decode_row_3"><td>00011</td><td>dirección</td><td>DIV</td></tr>';
		html += '<tr class="decode_row_4"><td>00100</td><td>dirección</td><td>MOV</td></tr>';
		html += '<tr class="decode_row_5"><td>00101</td><td>dirección</td><td>DEC</td></tr>';
		html += '<tr class="decode_row_6"><td>00110</td><td>dirección</td><td>INC</td></tr>';
		html += '<tr class="decode_row_7"><td>00111</td><td>dirección</td><td>CMP</td></tr>';
		html += '<tr class="decode_row_8"><td>01000</td><td>dirección</td><td>JZ</td></tr>';
		html += '<tr class="decode_row_9"><td>01001</td><td>dirección</td><td>JNZ</td></tr>';
		html += '<tr class="decode_row_10"><td>01010</td><td>dirección</td><td>NOT</td></tr>';
		html += '<tr class="decode_row_11"><td>01011</td><td>dirección</td><td>AND</td></tr>';
		html += '<tr class="decode_row_12"><td>01100</td><td>dirección</td><td>OR</td></tr>';
		html += '<tr class="decode_row_13"><td>01101</td><td>dirección</td><td>JA</td></tr>';
		html += '<tr class="decode_row_14"><td>01110</td><td>dirección</td><td>JAE</td></tr>';
		html += '<tr class="decode_row_15"><td>01111</td><td>dirección</td><td>JB</td></tr>';
		html += '<tr class="decode_row_16"><td>10000</td><td>dirección</td><td>JBE</td></tr>';
		html += '<tr class="decode_row_17"><td>10001</td><td>00001</td><td>IN</td></tr>';
		html += '<tr class="decode_row_18"><td>10010</td><td>00010</td><td>OUT</td></tr>';
		//html += '<tr class="decode_row_19"><td>10011</td><td>dirección</td><td>LOAD</td></tr>';
		//html += '<tr class="decode_row_20"><td>10100</td><td>dirección</td><td>STORE</td></tr>';
		//html += '<tr class="decode_row_21"><td>10101</td><td>01111</td><td>CLEAR</td></tr>';
		html += '</table></div>';
        return html
    },

    /**
     * Dibuja los buses de datos
     */    
    drawBus: function (html){
        html += '<div class="bus_control" id="bus_control"><h4>Bus <br/><br/> de <br/><br/> Control</h4></div>';
        html += '<div class="bus_data" id="bus_datos"><h4>Bus <br/><br/> de <br/><br/> Datos</h4> </div>';
        html += '<div class="bus_address" id="bus_direccion"><h4>Bus <br/><br/> de <br/><br/> Direcciones</h4> </div>';
        return html
    },


	
	/**
     * Dibuja y conecta las flechas
    */
	drawArrows: function() {
		/**var d = $('#drawing').html("");
		var w = d.width();
		var h = d.height();
		var paper = Raphael("drawing", w, h);
		paper.clear();

		function connect(from, to, attributes, label, labelAttributes) {

			function getX(i, a) {
				switch(a){
					case 'left':
						return i.position().left;
					case 'right':
						return i.position().left + i.outerWidth(true);
					case 'middle':
						return i.position().left + (i.outerWidth(true) / 2);
					default:
						var percentage = parseInt(a.replace("%", ""));
						return i.position().left + (i.outerWidth(true) * percentage / 100);
				}
			}
			
			function getY(i, a) {
				switch(a) {
					case 'top':
						return i.position().top;
					case 'bottom':
						return i.position().top + i.outerHeight(true);
					case 'middle':
						return i.position().top + (i.outerHeight(true) / 2);
					default:
						var percentage = parseInt(a.replace("%", ""));
						return i.position().top + (i.outerHeight(true) * percentage / 100);
				}
			}
			var x1 = getX(from.e, from.h);
			var x2 = x1;
			if(to.h) {
				x2 = getX(to.e, to.h);
			}
			
			var y1 = getY(from.e, from.v);
			var y2 = y1;
			if(to.v) {
				y2 = getY(to.e, to.v);
			}
			
			var e = paper.path("M" + Math.floor(x1) + " " + Math.floor(y1) + "L" +  Math.floor(x2) + " " + Math.floor(y2));
			if(attributes === undefined) {
				attributes = {"stroke-width": 10, "arrow-end":"block-narrow-short"};
			}
			e.attr(attributes);
			
			if(label) {
				var x = Math.floor((x1 + x2) / 2);
				var y = Math.floor((y1 + y2) / 2);
				var text = paper.text(x, y, label);
				if(labelAttributes) {
					text.attr(labelAttributes);
				}
			}
		}
		
		var PC = $('#reg_pc');
		var MAR = $('#reg_mar');
		var DECODE_UNIT = $('.decode_unit');
		var MBR = $('#reg_mbr');
		var IR = $('#reg_ir');
		var GENERAL_REGISTERS = $('#reg_r6');
		var ALU = $('#alu');
		var EAX = $('#reg_eax');
		var FLAGS = $('#reg_cf');
		var RAM = $('.ram');
		var CONTROL_UNIT = $('#cu');
		var BUS_CONTROL = $('#bus_control');
    	var BUS_DATOS = $('#bus_datos');
    	var BUS_DIRECCION = $('#bus_direccion');
		
		/**
		 * Conecta las flechas
		 
		connect({e:ALU, h:"left", v:"middle"}, {e:DECODE_UNIT, h:"right"}, {"stroke-width": 10, "arrow-start":"block-narrow-short"});
		connect({e:ALU, h:"20%", v:"top"}, {e:GENERAL_REGISTERS, v:"bottom"});
		
		connect({e:ALU, h:"right", v:"bottom"}, {e:MBR, h:"20%"}, {"stroke-width": 10, "arrow-start":"block-narrow-short"});
		connect({e:MBR, h:"20%", v:"top"}, {e:ALU, v:"87%"}, {"stroke-width": 10});
		
		connect({e:ALU, h:"right", v:"middle"}, {e:FLAGS,h:"left", v:"middle"});
		connect({e:PC, h:"right", v:"middle"}, {e:MAR, h:"left", v:"middle"});
		connect({e:DECODE_UNIT, h:"60%", v:"top"}, {e:PC, v:"bottom"});

		connect({e:DECODE_UNIT, h:"79%", v:"top"}, {e:MAR, h:"-376%", v:"200%"}, {"stroke-width": 10});
		connect({e:DECODE_UNIT, h:"77%", v:"-9%"}, {e:MAR, h:"middle", v:"195%"}, {"stroke-width": 10});
		connect({e:DECODE_UNIT, h:"270%", v:"-10%"}, {e:MAR, h:"45%", v:"bottom"});

		connect({e:MBR, h:"middle", v:"bottom"}, {e:IR, h:"middle", v:"top"});
		connect({e:IR, h:"left", v:"middle"}, {e:DECODE_UNIT, h:"right"});

		connect({e:EAX, h:"20%", v:"top"}, {e:ALU, v:"bottom"}, {"stroke-width": 10, "arrow-end":"block-narrow-short", "arrow-start": "block-narrow-short"});
		connect({e:MBR, h:"4%", v:"top"}, {e:EAX, h:"90%", v:"bottom"}, {"stroke-width": 10, "arrow-end":"block-narrow-short", "arrow-start": "block-narrow-short"});
		connect({e:BUS_CONTROL, h:"left", v:"91%"}, {e:CONTROL_UNIT, h:"right" , v:"middle"}, {"stroke-width": 10, "arrow-start":"block-narrow-short"});
		connect({e:BUS_DIRECCION, h:"left", v:"5%"}, {e:MAR, h:"right" }, {"stroke-width": 10, "arrow-start":"block-narrow-short"});
		connect({e:BUS_CONTROL, h:"middle", v:"5%"}, {e:RAM, h:"left"});
		connect({e:RAM, h:"left", v:"12%"}, {e:BUS_DATOS, h:"middle"});
		connect({e:BUS_DIRECCION, h:"middle", v:"20%"}, {e:RAM, h:"left"});
		connect({e:BUS_DATOS, h:"left", v:"66%"}, {e:MBR, h:"right"});
		connect({e:CONTROL_UNIT, h:"-97%", v:"middle"}, {e:ALU, h:"5%" ,v:"bottom"}, {"stroke-width": 10,  "arrow-end":"block-narrow-short"});
		connect({e:CONTROL_UNIT, h:"left", v:"middle"}, {e:ALU, h:"2%"}, {"stroke-width": 10, "arrow-start":"block-narrow-short"});
		connect({e:DECODE_UNIT, h:"right", v:"98%"}, {e:CONTROL_UNIT, h:"left", v:"bottom"});
		*/
	},


    /**
     * Crea la vista de toda la CPU
    */
    init: function(DOM_CPU){
		$(window).resize(CPU.drawArrows);
        CPU.DOM_CPU = DOM_CPU

        /**
         * Dibuja la RAM
         */
        var html ='<div id="drawing"></div>'
        html += '<div class="ram"><h3> MEMORIA </h3>';
        html = CPU.drawRamButtons(html)
		html += '<table class="table table-fixed table-striped table-hover"><thead><tr><th>Dirección</th><th>Valor</th></tr></thead>';
        var params = window.location.search
        var ram = []
        var initZeros = true
        /**
         * Si hay un programa cargado en la RAM no ponerla en ceros
         */
        if(ram = params.replace("ram=", "")) {
			if(ram = ram.match(/([0-9a-fA-F]{4})/g)) {
				initZeros = false;
			}
		}

        /**
         * Agrega valores a la ram
         */
        for(var address = 0; address < 16; address++) {
			CPU.RAM[address] = initZeros? 0 : CPU.hex2dec(ram[address]);
			console.log(ram);
			html += '<tr><td id="ram_address_' + address + '" class="value_address value_denary">' + address + '</td><td id="ram_value_' + address + '" class="value value_denary editable" data-description="Dirección de memoria ' + address + '">' + CPU.RAM[address] + '</td></tr>';
		}
        html += '</table>';
		html += '</div>';

        /**
         * Dibuja la CPU
         */
        html += '<div class="cpu"><h3> CPU</h3>';
        function getRegisterHtml(name, value, desc) {
            if(name.toLowerCase() == "pc" || name.toLowerCase() == "mar"){
                return '<div class="register_address" id="reg_' + name.toLowerCase()+'"><div class="reg_name">' + name + '</div><div id="reg_' + name.toLowerCase() + '_val" class="reg_val value value_address value_denary editable" data-description="' + desc + '">' + value + '</div></div>';
            }
			if(['r1', 'r2', 'r3', 'r4', 'r5', 'r6'].includes(name.toLowerCase())){
				return '<div class="general_register" id="reg_' + name.toLowerCase()+'"><div class="reg_name">' + name + '</div><div id="reg_' + name.toLowerCase() + '_val" class="reg_val value value_denary editable" data-description="' + desc + '">' + value + '</div></div>';
			}
			if(['of', 'cf', 'zf'].includes(name.toLowerCase())){
				return '<div class="flag_register" id="reg_' + name.toLowerCase()+'"><div class="reg_name">' + name + '</div><div id="reg_' + name.toLowerCase() + '_val" class="reg_val value value_flag value_denary editable" data-description="' + desc + '">' + value + '</div></div>';
			}
			return '<div class="register" id="reg_' + name.toLowerCase()+'"><div class="reg_name">' + name + '</div><div id="reg_' + name.toLowerCase() + '_val" class="reg_val value value_denary editable" data-description="' + desc + '">' + value + '</div></div>';
		}

        html += getRegisterHtml('PC', 0, "Contador del programa");
		html += getRegisterHtml('MAR', 0, "Registro de dirección de memoria");
		html += getRegisterHtml('MBR', 0, "Registro intermedio de memoria");
		html += getRegisterHtml('EAX', 0, "Acumulador");
		html += getRegisterHtml('IR', 0, "Registro de instrucción");
		html += getRegisterHtml('R1', 0, "Registro general 1");
		html += getRegisterHtml('R2', 0, "Registro general 2");
		html += getRegisterHtml('R3', 0, "Registro general 3");
		html += getRegisterHtml('R4', 0, "Registro general 4");
		html += getRegisterHtml('R5', 0, "Registro general 5");
		html += getRegisterHtml('R6', 0, "Registro general 6");
		html += getRegisterHtml('OF', 0, "Desbordamiento Over Flow Flag");
		html += getRegisterHtml('CF', 0, "Acarreo Carry Flag");
		html += getRegisterHtml('ZF', 0, "Zero Flag");

        html += '<div id="alu">ALU</div>';
		html += '<div id="cu">Unidad de Control</div>';

        html = CPU.drawDecoder(html)
        html += '</div>';

        html = CPU.drawBus(html)

		
        $(DOM_CPU).html(html);
		CPU.drawArrows();

		

		$('#modal_change_value').modal({ show: false})
		
		/**
		 * Hace un reset a la cpu
		 * pone los valores en 0
		 */
		$('#btn_reset_cpu').click(function() {
			CPU.STATE = 0;
			for(const reg in CPU.REGISTERS){
				CPU.REGISTERS[reg] = 0
			}
			CPU.showHint("Registros de la CPU reiniciados")
			$('.current_instruction').removeClass('current_instruction');	
			CPU.updateRegisters();
		});		

		setTimeout(function() {
			$('#st-2').addClass('st-hidden');
		}, 5000);

		/**
		 * Hace un reset a la memoria
		 * pone los valores en 0
		 */
		$('#btn_reset_ram').click(function() {
			CPU.showHint("Registros de memoria reiniciados");
			for(var address = 0; address < 16; address++) {
				CPU.RAM[address] = 0;
				var jq = $('#ram_value_' + address);
				if(jq.hasClass('value_denary')) {
					jq.text(0);
				}
				if(jq.hasClass('value_binary')) {
					jq.text("00000000");
				}
				if(jq.hasClass('value_hex')) {
					jq.text("00");
				}
			}
		});

/**
		 * Acepta los cambios
		 */
		$('.value.editable, .value_address.editable, .value_flag.editable').click(function(e) {
			var id = e.currentTarget.id;
			
			var jq = $('#' + id);
			$('#modal_change_value_title').text(jq.data("description"));
			$('#change_value_from').text(jq.text());
			$('#change_value_to').val(jq.text());
			CPU.lastChangedValue = id;
			$('#modal_change_value').modal('show')
		});

		/**
		 * Acepta los cambios
		 */
		$('#btn_change_value_ok').click(function() {
			function getInt(jq, val) {
				if(jq.hasClass('value_hex')) {
					return CPU.hex2dec(val);
				}
				if(jq.hasClass('value_binary')) {
					return CPU.bin2dec(val);
				}
				val = parseInt(val, 10) & 0xFFFF;
				return val >= 128? val - 256: val;
			}
			
			var jq = $('#' + CPU.lastChangedValue);
			var value = $('#change_value_to').val();
			var parts = CPU.lastChangedValue.split("_");
			switch(parts[0]) {
				case 'ram':
					var address = parseInt(parts[2]);
					CPU.RAM[address] = getInt(jq, value);
				break;
				case 'reg':
					var reg = parts[1];
					CPU.REGISTERS[reg] = getInt(jq, value);
				break;
				
			}

			CPU.updateRegisters();
		});

		/**
		 * Ejecutae el programa paso a paso
		 */
		$('#btn_step').click(CPU.step);

		/**
		 * Ejecutae el programa de manera continua
		*/
		$('#btn_run').click(function() {
			if(CPU.RUNNING && CPU.NEXT_TIMEOUT) {
				clearTimeout(CPU.NEXT_TIMEOUT);
			} else {
				CPU.RUNNING = true;
				CPU.step();
			}
		});

		$('#modal_change_value').on('shown.bs.modal', function() {
			$('#change_value_to').focus().select();
		});


        /**
         * Permite cambiar la forma en la que se visualizan los 
         * valores de los registros entre binario, decimal y hexadecimal
         */
		$('.btn_values').click(function(e) {
			var mode = e.currentTarget.id.split("_")[2];
			$('.value, .value_address, .value_flag').each(function(index, element) {
				var jq = $(this);
				var val = jq.text();
				if(jq.hasClass("value_binary")) {
					val = parseInt(val, 2);
				}
				if(jq.hasClass("value_denary")) {
					val = parseInt(val, 10);
				}
				if(jq.hasClass("value_hex")) {
					val = parseInt(val, 16);
				}
				switch(mode) {
					case 'binary':
						jq.text(CPU.dec2bin(val));
						break
					case 'hex':
						jq.text(CPU.dec2hex(val));
						break;
					case 'denary':
						jq.text(val);
				}
			}).removeClass("value_binary value_denary value_hex").addClass("value_" + mode);
		
		});
		
		$('#btn_values_binary').trigger("click");
    }
}
$(function() {
	CPU.init("#cpu")
});