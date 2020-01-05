const text = `
PROGRAM Part10;
VAR
   number     : INTEGER;
   a, b, c, x : INTEGER;
   y          : REAL;

PROCEDURE P1;
VAR
  a, k: INTEGER;

  PROCEDURE P2;
  VAR
    a: REAL;
    k: INTEGER;

  BEGIN {P2}
    a := 66.6;
    k := 777;
  END;

BEGIN {P1}
  a := 555;
  k := 444;
END;

PROCEDURE P2;
VAR
  a, k: REAL;

BEGIN {P2}
  a := 22.2;
  k := 33.3;
END;

BEGIN {Part10}
   BEGIN
      number := 2;
      a := number;
      b := 10 * a + 10 * number DIV 4;
      c := a - - b
   END;
   x := 11;
   y := 20 / 7 + 3.14;
   { writeln('a = ', a); }
   { writeln('b = ', b); }
   { writeln('c = ', c); }
   { writeln('number = ', number); }
   { writeln('x = ', x); }
   { writeln('y = ', y); }
END.  {Part10}
`

export default text
