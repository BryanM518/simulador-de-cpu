//HALT
case 7: 
setState(7, "Ciclo de ejecución", "Se ha *detenido* la ejecución del programa");
$('.active').removeClass('active');
CPU.RUNNING = false;
break;

//LOAD
case 8: 
setState(81, "Decodificación de instrucción", "El *decodificador* envia el operando al *MBR* y este a su vez lo envia al *bus de direcciones*");
CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mar').addClass('active');
break;

case 81: 
setState(82, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección en el *bus de direcciones* y coloque el valor en el *bus de datos*");
$('.active').removeClass('active');
$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
break;
case 82:
setState(83, "Ciclo de ejecución", "La *Unidad de Control* copia el valor del *Bus de Datos* en el *MBR*");
CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mbr').addClass('active');
break;
case 83:
setState(23, "Ciclo de ejecución", "La *unidad de control* envia el valor del *MBR* al acumulador");
CPU.REGISTERS.EAX = CPU.REGISTERS.MBR;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mbr,#reg_eax').addClass('active');
break;

//STORE	
case 9:
setState(91, "Decodificación de instrucción", "La *unidad de control* envia el valor del *acumulador* al *MBR*");
CPU.REGISTERS.MBR = CPU.REGISTERS.EAX;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_eax,#reg_mbr').addClass('active');
break;
case 91:
setState(92, "Decodificación de instrucción", "El *decodificador* envia el *operando* al *MAR* y este lo envia al *Bus de direcciones*");
CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mar').addClass('active');
break;
case 92: 
setState(0, "Ciclo de ejecución", "La *unidad de control* le dice a la memoria que guarde el valor que se encuentra en el *bus de datos* en la dirección que se encuentra en el *bus de direcciones*");
CPU.RAM[CPU.REGISTERS.MAR] = CPU.REGISTERS.MBR;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
break;

//ADD
case 10:
setState(101, "Decodificación de instrucción", "El *decodificador* envía el *codop* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mar,.decode_row_1').addClass('active');
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
setState(0, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que sume el valor del *acumulador* y el *MBR*. El resultado lo coloca de nuevo en el *acumulador");
CPU.REGISTERS.EAX += CPU.REGISTERS.MBR;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mbr,#alu,#acc').addClass('active');
break;

//SUB
case 11:
setState(111, "Decodificación de instrucción", "El *decodificador* envía el *codop* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mar,.decode_row_1').addClass('active');
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
setState(0, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que sume el valor del *acumulador* y el *MBR*. El resultado lo coloca de nuevo en el *acumulador");
CPU.REGISTERS.EAX = CPU.REGISTERS.MBR - CPU.REGISTERS.EAX;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mbr,#alu,#acc').addClass('active');
break;

//MPY
        case 12:
        setState(121, "Decodificación de instrucción", "El *decodificador* envía el *codop* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
        CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
        CPU.updateRegisters();
        $('.active').removeClass('active');
        $('#reg_mar,.decode_row_1').addClass('active');
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
        setState(0, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que sume el valor del *acumulador* y el *MBR*. El resultado lo coloca de nuevo en el *acumulador");
        CPU.REGISTERS.EAX *= CPU.REGISTERS.MBR;
        CPU.updateRegisters();
        $('.active').removeClass('active');
        $('#reg_mbr,#alu,#acc').addClass('active');
        break;

//DIV
case 13:
setState(131, "Decodificación de instrucción", "El *decodificador* envía el *codop* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mar,.decode_row_1').addClass('active');
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
setState(0, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que sume el valor del *acumulador* y el *MBR*. El resultado lo coloca de nuevo en el *acumulador");
CPU.REGISTERS.EAX = Math.floor(CPU.REGISTERS.MBR / CPU.REGISTERS.EAX);
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mbr,#alu,#acc').addClass('active');
break;

// AND bit a bit
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
setState(0, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que haga el AND bit a bit y luego pone el resultado en el *acumulador*");
console.log("eax-before",CPU.REGISTERS.EAX)
CPU.REGISTERS.EAX = CPU.REGISTERS.MBR & CPU.REGISTERS.EAX
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mbr,#reg_eax,#alu,#acc').addClass('active');
break;

// OR bit a bit
case 15:
setState(151, "Decodificación de instrucción", "El *decodificador* envía el *codop* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mar,.decode_row_1').addClass('active');
break;
case 151: 
setState(152, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
$('.active').removeClass('active');
$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
break;
case 152:
setState(153, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mbr').addClass('active');
break;
case 153:
setState(0, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que haga el OR bit a bit y luego pone el resultado en el *acumulador*");
console.log("eax-before",CPU.REGISTERS.EAX)
CPU.REGISTERS.EAX = CPU.REGISTERS.MBR | CPU.REGISTERS.EAX
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mbr,#reg_eax,#alu,#acc').addClass('active');
break;

// NOT bit a bit
case 16:
setState(161, "Decodificación de instrucción", "El *decodificador* envía el *codop* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mar,.decode_row_1').addClass('active');
break;
case 161: 
setState(162, "Ciclo de ejecución", "La *unidad de control* le indica a la *memoria* que busque la dirección y coloque el valor en el *bus de datos*");
$('.active').removeClass('active');
$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
break;
case 162:
setState(163, "Ciclo de ejecución", "La *unidad de control* coloca el valor del *bus de datos* en el *MBR*");
CPU.REGISTERS.MBR = CPU.RAM[CPU.REGISTERS.MAR];
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mbr').addClass('active');
break;
case 163:
setState(0, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que haga el NOT bit a bit y luego pone el resultado en el *acumulador*");
console.log("eax-before",CPU.REGISTERS.EAX)
CPU.REGISTERS.EAX = ~CPU.REGISTERS.MBR
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mbr,#reg_eax,#alu,#acc').addClass('active');
break;

// CMP
case 17:
setState(171, "Decodificación de instrucción", "El *decodificador* envía el *codop* al *MAR* y a su vez este lo envia al *Bus de Direcciones*.");
CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mar,.decode_row_1').addClass('active');
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
setState(0, "Ciclo de ejecución", "La *unidad de control* le indica a la *ALU* que haga la comparación y dependiendo del resultado se establecen los registros de banderas CFy ZF en 0 o 1");
if(CPU.REGISTERS.MBR == CPU.REGISTERS.EAX){
    CPU.REGISTERS.ZF = 1
} 
else if(CPU.REGISTERS.MBR > CPU.REGISTERS.EAX){
    CPU.REGISTERS.CF = 1
}
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mbr,#reg_eax,#reg_cf,#reg_zf,#alu,#acc').addClass('active');
break;

// JMP - JUMP condicional
case 18:
setState(0, "Ciclo de ejecución", "La *unidad de control* verifica que el registro *ZF* este en 1 (si está en 0 se realiza un salto)");
if(CPU.REGISTERS.ZF == 0){
    CPU.REGISTERS.PC = CPU.REGISTERS.IR & 0x0F
} 
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mar,#reg_pc,#reg_zf').addClass('active');
break;

// JG - JUMP IF GREATER
case 19:
setState(0, "Ciclo de ejecución", "La *unidad de control* verifica que el registro *ZF* este en 0 y que *CF* sea 1 (esto indica que el valor del registro es mayor al acumulador)");
if(CPU.REGISTERS.ZF == 0 && CPU.REGISTERS.CF == 1){
    CPU.REGISTERS.PC = CPU.REGISTERS.IR & 0x0F
} 
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mar,#reg_pc,#reg_zf').addClass('active');
break;


// INPUT / OUTPUT
case 20:
setState(23, "Ciclo de ejecución", "El *bus de control* lee el *dispositivos de entrada* y coloca el dato en el *acumulador*");
CPU.REGISTERS.EAX = parseInt(prompt("Ingresar valor decimal:")) & 0xFF;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_eax').addClass('active');
break;
case 21:
setState(23, "Ciclo de ejecución", "El *bus de control* envia el valor del *acumulador* al *dispositivo de salida*");
alert("Resultado: " + CPU.REGISTERS.EAX);
$('.active').removeClass('active');
$('#reg_eax').addClass('active');
break;

//CLEAR	
case 22:
setState(222, "Decodificación de instrucción", "El *decodificador* envia el *operando* al *MAR* y este lo envia al *Bus de direcciones*");
CPU.REGISTERS.MAR = CPU.REGISTERS.IR & 0x0F;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#reg_mar').addClass('active');
break;
case 222: 
setState(0, "Ciclo de ejecución", "La *unidad de control* le dice a la memoria que asigne el valor de 0 en la dirección que se encuentra en el *bus de direcciones*");
CPU.RAM[CPU.REGISTERS.MAR] = 0;
CPU.updateRegisters();
$('.active').removeClass('active');
$('#ram_value_' + CPU.REGISTERS.MAR).addClass('active');
break;



case 23:
setState(0, "Ciclo de ejecución", "La *unidad de control* comprueba si hay *interrupciones* o si puede volver a iniciar el ciclo");
break;
