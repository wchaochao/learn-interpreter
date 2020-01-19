const text = `
program Main;
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
   end;  { AlphaB }

begin { Main }
end.  { Main }
`

export default text
