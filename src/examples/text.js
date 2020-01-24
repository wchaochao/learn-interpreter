const text = `program Main;
   var b, x, y : real;
   var z : integer;

   procedure AlphaA;
      var b : integer;

      procedure Beta(c : integer);
         var y : integer;

         procedure Gamma(c, d : integer; a: integer);
            var x : integer;
         begin { Gamma }
            x := a + b + c + x + y + z;
         end;  { Gamma }

      begin { Beta }
      end;  { Beta }

   begin { AlphaA }
   end;  { AlphaA }

   procedure AlphaB(a, b : integer);
      var c : real;
   begin { AlphaB }
      c := a + b;
      y := -a + 1.2;
      z := 1;
   end;  { AlphaB }

begin { Main }
  x := 1.2;
  begin
    y := 2.3;
  end;
end.  { Main }
`

export default text
